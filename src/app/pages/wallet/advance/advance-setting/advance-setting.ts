import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from './../../../../@core/services/wallet.service';
import { UserService } from './../../../../@core/services/user.service';
import { MultiSignService } from './../../../../@core/services/multi-sign.service';
import { MSWalletService } from './../../../../@core/services/ms-wallet.service';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import { SocketService } from './../../../../@core/services/socket.service';
import { errors } from './../../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './advance-setting.html',
    styleUrls: ['./advance-setting.scss']
})

export class AdvanceSettingComponent implements OnInit {

	wallet: any = null;
	signers: Array<any> = [];
	masterKey: any = null;
	thresholds: any = null;
	signersForReset: Array<any> = [];
	masterKeyForReset: any = null;
	thresholdsForReset: any = null;
	isFirst: boolean;

	waitResponse: boolean = false;
    typeTfaConfirm: string = '';
    options_choose_signer: any = null;
    selectedSigner: any = null;
    typeOptionsChooseSigner: string = '';
    signer_for_update: any = null;
    signer_for_remove: any = null;
  masterKey_for_remove: any = null;
    editingAddress: any = null;

	newSigner: any = {
		address: '',
		weight: 1
	}

    constructor(
    	private route: ActivatedRoute,
    	private router: Router,
    	private walletService: WalletService,
    	private userService: UserService,
    	private multiSignService: MultiSignService,
        private mSWalletService: MSWalletService,
    	private t: TranslatePipe,
        private socketService: SocketService
    ) {}

    ngOnInit() {
    	this.route.params.subscribe(params => {
           	let id_wallet = params.id ? params.id : '';
           	this.getUserWallet(id_wallet)
        });
    }

    async getUserWallet(id_wallet){
    	let data = {
    		 id: id_wallet,
	        with_assets: true,
	        skipUser: true,
    	}
    	let response = await this.walletService.getUserWallet(data);
    	if(!response.success){
    		return;
    	}
    	this.wallet = response.result;
        this.options_choose_signer = {signers: this.wallet.signers};
    	this.signers = this.wallet.signers.filter((signer, index) => {
      		return signer.public_key !== this.wallet.address;
    	}).map((signer, index) => {
      		return {address: signer.public_key, weight: signer.weight};
    	});

    	this.masterKey = this.wallet.signers.filter((signer, index) => {
      		return signer.public_key === this.wallet.address;
    	}).map(function (signer, index) {
      		return {address: signer.public_key, weight: signer.weight};
    	})[0];
        this.socketService.thresholds = this.wallet.thresholds;
    	this.thresholds = this.socketService.thresholds;
    	//bk scope
	    this.signersForReset = [...this.signers];
	    this.masterKeyForReset = {...this.masterKey};
	    this.thresholdsForReset = {...this.thresholds};
	    this.isFirst = !response.result.type ? true : false;

        //  SOCKET
        this.socketService.onSocketNotification().subscribe(
            (message: any) => {
                this.thresholds = message.pendingTransaction.walletID.thresholds;
            }
        );
    }

    remove(key) {
        if (key === this.wallet.address) {
            swal({
                title: this.t.transform('confirm'),
                text: this.t.transform('remove_master_key'),
                showCancelButton: true,
                confirmButtonText: this.t.transform('yes_delete'),
                cancelButtonText: this.t.transform('cancel'),
                confirmButtonColor: '#4018AC',
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    this.masterKey.weight = 0;
                }
            });
        }else {
          //update current singer to 0 to remove
          let pos = this.signers.map((e) => {
            return e.address;
          }).indexOf(key);
          this.signers.splice(pos, 1);
        }
    }

    add(newSigner) {
        if (!newSigner.address)
            swal(
                this.t.transform('signer_required'),
                '',
                'error'
            )
        else if (this.signers.map((e) => {
                return e.address;
            }).indexOf(newSigner.address) > -1 || newSigner.address === this.masterKey.address)
            swal(
                this.t.transform('signer_duplicate'),
                '',
                'error'
            )
        else if (newSigner && newSigner.weight == 0 || newSigner.weight > 10)
            swal(
                this.t.transform('weight_greater_than_0_and_lower_or_equals_to_10'),
                '',
                'error'
            )
        else
            this.signers.push({address: newSigner.address, weight: newSigner.weight});

        this.newSigner = {address: null, weight: 1};

    }

    checkMasterKey(masterWeight) {
        if (masterWeight == 0) {
            swal(
                this.t.transform('weight_greater_than_0'),
                '',
                'error'
            )
            this.resetScope();
        }
    }

    resetScope() {
        this.signers = [...this.signersForReset];
        this.masterKey = {...this.masterKeyForReset};
        this.thresholds = {...this.thresholdsForReset};
    }

    undoThresholds(){
        this.thresholds = {...this.thresholdsForReset};
    }

    OK() {
        this.typeTfaConfirm = 'ok';
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        if(this.typeTfaConfirm === 'ok'){
            let data = {
                code: event,
                walletAddress: this.wallet.address,
                signers: this.signers,
                masterWeight: this.masterKey.weight,
                thresholds: {
                    low: this.thresholds.low_threshold,
                    med: this.thresholds.med_threshold,
                    high: this.thresholds.high_threshold
                }
            };
            this.waitResponse = true;
            let response = await this.mSWalletService.setupMultiSignWallet(data);
            this.waitResponse = false;
            if(!response.success){
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                )
                return;
            }
            this.router.navigate(['/wallet/advance-wallet']);
        }else if(this.typeTfaConfirm === 'onChooseSignerDialogaddSigner'){
            let data = {
                code: event,
                walletAddress: this.wallet.address,
                sourceAddress: this.selectedSigner.public_key,
                signerAddress: this.newSigner.address,
                signerWeight: this.newSigner.weight
            }
            if (!this.newSigner.address)
                swal(
                    this.t.transform('signer_required'),
                    '',
                    'error'
                )
            else if (this.signers.map((e) => {
                    return e.address;
                }).indexOf(this.newSigner.address) > -1 || this.newSigner.address === this.masterKey.address)
                swal(
                    this.t.transform('signer_duplicate'),
                    '',
                    'error'
                )
            else if (this.newSigner && this.newSigner.weight == 0 || this.newSigner.weight > 10)
                swal(
                    this.t.transform('weight_greater_than_0_and_lower_or_equals_to_10'),
                    '',
                    'error'
                )
            else{
                this.waitResponse = true;
                let response = await this.mSWalletService.settingSignerMultiSignWallet(data);
                this.waitResponse = false;
                if(!response.success){
                    this.newSigner = {address: null, weight: 1};
                    swal(
                      this.t.transform(errors[response.error.errorCode]),
                      '',
                      'error'
                    );
                    return;
                }
                if(response.result.status == 1){
                    swal(
                        this.t.transform('add_new_signer_successfully'),
                        '',
                        'success'
                    );
                    this.wallet = response.result.walletID;
                    if (this.newSigner.address !== this.masterKey.address)
                        this.signers.push(this.newSigner);
                    else
                        this.masterKey.weight = this.newSigner.weight;

                    this.updateBackUpScope();
                }else if (response.result.status == 2){
                    swal(
                        this.t.transform('transaction_submit_fail'),
                        '',
                        'error'
                    );
                    this.router.navigate(['/wallet/advance-transaction']);
                }else{
                    this.router.navigate(['/wallet/advance-transaction/', response.result._id]);
                }
            }
        }else if(this.typeTfaConfirm === 'onChooseSignerDialogRemoveSigner'){
            swal({
                title: this.t.transform('confirm_'),
                text: this.t.transform('are_you_sure_remove_key'),
                showCancelButton: true,
                confirmButtonText: this.t.transform('yes_delete'),
                cancelButtonText: this.t.transform('cancel_'),
                confirmButtonColor: '#4018AC',
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    this.waitResponse = true;
                    let data = {
                        code: event,
                        walletAddress: this.wallet.address,
                        sourceAddress: this.selectedSigner.public_key,
                        signerAddress: this.signer_for_remove.address,
                        signerWeight: 0
                    }
                    this.mSWalletService.settingSignerMultiSignWallet(data).then(
                        (response) => {
                            this.waitResponse = false;
                            if(!response.success){
                                swal(
                                    this.t.transform(errors[response.error.errorCode]),
                                    '',
                                    'error'
                                );
                                return;
                            }
                            if (response.result.status == 1) {
                                swal(
                                    this.t.transform('remove_new_signer_successfully'),
                                    '',
                                    'success'
                                );
                                this.wallet = response.result.walletID;
                                let pos = this.signers.map((e) => {
                                    return e.address;
                                }).indexOf(this.signer_for_remove.address);
                                if (pos > -1) {
                                    this.signers.splice(pos, 1);
                                }
                                this.updateBackUpScope();
                            }else if (response.result.status == 2) {
                                swal(
                                    this.t.transform('transaction_submit_fail'),
                                    '',
                                    'error'
                                );
                                this.router.navigate(['/wallet/advance-transaction']);
                            }else{
                                this.router.navigate(['/wallet/advance-transaction/', response.result._id]);
                            }
                        },
                        (error) => {
                            this.waitResponse = false;
                        }
                    );
                }
            });

        }else if(this.typeTfaConfirm === 'onChooseSignerDialogRemoveMaster'){
            swal({
                title: this.t.transform('confirm_'),
                text: this.t.transform('are_you_sure_remove_master_key'),
                showCancelButton: true,
                confirmButtonText: this.t.transform('yes_delete'),
                cancelButtonText: this.t.transform('cancel_'),
                confirmButtonColor: '#4018AC',
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    this.waitResponse = true;
                    let data = {
                        code: event,
                        walletAddress: this.wallet.address,
                        sourceAddress: this.selectedSigner.public_key,
                        signerAddress: this.masterKey_for_remove.address,
                        signerWeight: 0
                    }
                    this.mSWalletService.settingSignerMultiSignWallet(data).then(
                        (response) => {
                            this.waitResponse = false;
                            if(response.success){
                                if (response.result.status == 1) {
                                    swal(
                                        this.t.transform('remove_master_key_successfully'),
                                        '',
                                        'success'
                                    );
                                    this.wallet = response.result.walletID;
                                    this.masterKey.weight = 0;
                                    this.updateBackUpScope();
                                }else if (response.result.status == 2) {
                                    swal(
                                        this.t.transform('transaction_submit_fail'),
                                        '',
                                        'error'
                                    );
                                    this.router.navigate(['/wallet/advance-transaction']);
                                }else{
                                    this.router.navigate(['/wallet/advance-transaction/', response.result._id]);
                                }
                            }else{
                                swal(
                                    this.t.transform(errors[response.error.errorCode]),
                                    '',
                                    'error'
                                );
                            }
                        },
                        (error) => {
                            this.waitResponse = false;
                        }
                    );
                }
            });
        }else if(this.typeTfaConfirm === 'onChooseSignerDialogUpdateSigner'){
            let data = {
                code: event,
                walletAddress: this.wallet.address,
                sourceAddress: this.selectedSigner.public_key,
                signerAddress: this.signer_for_update.address,
                signerWeight: this.signer_for_update.weight
            }
            if(this.signer_for_update.weight == 0){
                swal({
                    title: this.t.transform('confirm_'),
                    text: this.t.transform('signer_will_be_remove_weight_equal_0_are_you_sure'),
                    showCancelButton: true,
                    confirmButtonText: this.t.transform('yes_delete'),
                    cancelButtonText: this.t.transform('cancel_'),
                    confirmButtonColor: '#4018AC',
                    reverseButtons: true,
                }).then((result) => {
                    if (result.value) {
                        this.waitResponse = true;
                        this.mSWalletService.settingSignerMultiSignWallet(data).then(
                            (response) => {
                                this.waitResponse = false;
                                if(response.success){
                                    if (response.result.status == 1) {
                                        swal(
                                            this.t.transform('remove_master_key_successfully'),
                                            '',
                                            'success'
                                        );
                                        this.wallet = response.result.walletID;
                                        let pos = this.signers.map((e) => {
                                            return e.address;
                                        }).indexOf(this.signer_for_update.address);
                                        if (pos > -1) {
                                            this.signers.splice(pos, 1);
                                        }else{
                                            this.masterKey = null;
                                        }
                                        this.updateBackUpScope();
                                    }else if (response.result.status == 2) {
                                        swal(
                                            this.t.transform('transaction_submit_fail'),
                                            '',
                                            'error'
                                        );
                                        this.router.navigate(['/wallet/advance-transaction']);
                                    }else{
                                        this.router.navigate(['/wallet/advance-transaction/', response.result._id]);
                                    }
                                }else{
                                    this.resetScope();
                                    swal(
                                        this.t.transform(errors[response.error.errorCode]),
                                        '',
                                        'error'
                                    );
                                }
                            },
                            (error) => {
                                this.resetScope();
                                this.waitResponse = false;
                            }
                        );
                    }
                });
            }else{
                this.waitResponse = true;
                let response = await this.mSWalletService.settingSignerMultiSignWallet(data);
                this.waitResponse = false;
                if(!response.success){
                    this.resetScope();
                    swal(
                        this.t.transform(errors[response.error.errorCode]),
                        '',
                        'error'
                    );
                    return;
                }
                if (response.result.status == 1) {
                    swal(
                        this.t.transform('you_edited_signer_successfully'),
                        '',
                        'success'
                    );
                    this.wallet = response.result.walletID;
                }else if (response.result.status == 2) {
                    swal(
                        this.t.transform('transaction_submit_fail'),
                        '',
                        'error'
                    );
                    this.router.navigate(['/wallet/advance-transaction']);
                }else{
                    this.router.navigate(['/wallet/advance-transaction/', response.result._id]);
                }
            }
        }else if(this.typeTfaConfirm === 'onChooseSignerDialogOKThresholds'){
            let data = {
                code: event,
                walletAddress: this.wallet.address,
                sourceAddress: this.selectedSigner.public_key,
                masterWeight: this.masterKey.weight,
                lowThreshold: this.thresholds.low_threshold,
                medThreshold: this.thresholds.med_threshold,
                highThreshold: this.thresholds.high_threshold,
            }
            this.waitResponse = true;
            let response = await this.mSWalletService.settingThresholdsMultiSignWallet(data);
            this.waitResponse = false;
            if(!response.success){
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
                return;
            }
            if (response.result.status == 1) {
                swal(
                    this.t.transform('you_updated_permission_for_the_wallet'),
                    '',
                    'success'
                );
            }else if (response.result.status == 2) {
                swal(
                    this.t.transform('transaction_submit_fail'),
                    '',
                    'error'
                );
                this.router.navigate(['/wallet/advance-transaction']);
            }else{
                this.router.navigate(['/wallet/advance-transaction/', response.result._id]);
            }
        }
    }

    undoSigner() {
        this.signers = [...this.signersForReset];
        this.masterKey = {...this.masterKeyForReset};
        this.editingAddress = null;
    }

    handleNewWeightInput(e){
        if (this.newSigner.weight === undefined || this.newSigner.weight === null) this.newSigner.weight = 1;
        else {
            if (this.newSigner.weight !== null && !Number.isInteger(this.newSigner.weight)) this.newSigner.weight = Math.floor(this.newSigner.weight);
            else if (this.newSigner.weight !== null && this.newSigner.weight < 1) this.newSigner.weight = 1;
            else if (this.newSigner.weight !== null && !this.userService.isSuperUser && this.newSigner.weight > 10) this.newSigner.weight = 10;
        }
    }

    
    OKThresholds(){
        this.typeOptionsChooseSigner = "OKThresholds";
        $('#chooseSignerDialog').modal('show');
    }

    updateSigner(signer){
      if (Number(signer.weight) <= 0) {
        swal(
          this.t.transform('weight_greater_than_0'),
          '',
          'warning'
        )
        this.resetScope();
      }else {
        swal({
          title: this.t.transform('confirm_'),
          text: this.t.transform('are_you_changing_the_signer'),
          showCancelButton: true,
          confirmButtonText: this.t.transform('ok_'),
          cancelButtonText: this.t.transform('cancel_'),
          confirmButtonColor: '#4018AC',
          reverseButtons: true,
        }).then((result) => {
          if (result.value) {
            this.signer_for_update = signer;
            this.typeOptionsChooseSigner = "updateSigner";
            $('#chooseSignerDialog').modal('show');
          }
        });
      }
    }

    removeMaster(masterKey){
	      this.masterKey_for_remove = masterKey;
        this.typeOptionsChooseSigner = "removeMaster";
        $('#chooseSignerDialog').modal('show');
    }

    updateBackUpScope(){
        this.signersForReset = [...this.signers];
        this.masterKeyForReset = {...this.masterKey};
    }

    removeSigner(currentSigner){
        this.signer_for_remove = currentSigner;
        this.typeOptionsChooseSigner = "removeSigner";
        $('#chooseSignerDialog').modal('show');
    }

    addSigner(){
        this.typeOptionsChooseSigner = "addSigner";
        $('#chooseSignerDialog').modal('show');
    }

    onChooseSignerDialog(event){
        this.selectedSigner = event;
        if(this.typeOptionsChooseSigner === "addSigner"){
            this.typeTfaConfirm = 'onChooseSignerDialogaddSigner';
        }else if(this.typeOptionsChooseSigner === "removeSigner"){
            this.typeTfaConfirm = 'onChooseSignerDialogRemoveSigner';
        }else if(this.typeOptionsChooseSigner === "removeMaster"){
            this.typeTfaConfirm = 'onChooseSignerDialogRemoveMaster';
        }else if(this.typeOptionsChooseSigner === "updateSigner"){
            this.typeTfaConfirm = 'onChooseSignerDialogUpdateSigner';
        }else if(this.typeOptionsChooseSigner === "OKThresholds"){
             this.typeTfaConfirm = 'onChooseSignerDialogOKThresholds';
        }
        $('#tfaConfirmDialog').modal('show');
    }

    onChangeHighThreshold(event){
        let val = event.value;
        this.thresholds.high_threshold = val;
        if(val < this.thresholds.med_threshold){
            this.thresholds.med_threshold = val;
        }
        if(val < this.thresholds.low_threshold){
            this.thresholds.low_threshold = val;
        }
    }

    onChangeMedThreshold(event){
        let val = event.value;
        let val_pre = this.thresholds.med_threshold;
        this.thresholds.med_threshold = val;
        if(val > this.thresholds.high_threshold){
            setTimeout(() => {
                this.thresholds.med_threshold = val_pre;
            }, 200)
        }else{
            if(val < this.thresholds.low_threshold){
                this.thresholds.low_threshold = val;
            }
        }
    }

    onChangeLowThreshold(event){
        let val = event.value;
        let val_pre = this.thresholds.low_threshold;
        this.thresholds.low_threshold = val;
        if(val > this.thresholds.med_threshold){
            setTimeout(() => {
                this.thresholds.low_threshold = val_pre;
            }, 200)
        }
    }

    onChangeMasterKey(event){
        if (!this.editingAddress) this.editingAddress = {...this.masterKey};
        this.masterKey.weight = event.value;
        
    }

    onChangeSignerKey(event, signer){
        if (!this.editingAddress) this.editingAddress = signer;
        let index = this.signers.findIndex(item => {
            return item.address === signer.address
        })
        if (index >= 0) {
            this.signers[index] = {address: this.signers[index].address, weight: event.value};
        }
    }
}

import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from './../../../../@core/services/wallet.service';
import { UserService } from './../../../../@core/services/user.service';
import { MultiSignService } from './../../../../@core/services/multi-sign.service';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import { errors } from './../../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './multisign-wallet-setting.html',
    styleUrls: ['./multisign-wallet-setting.scss']
})

export class MultisignUserWalletSettingComponent implements OnInit {

	wallet: any;
	signers: Array<any> = [];
	masterKey: any = null;
	thresholds: any = null;
	simulateQuery = false;
	isDisabled = false;
	typeList = [];
	type = null;

	isSuccess = false;
	timer = 5;
	newAddress = null;
	newWeight: number = null;
	isAddOrEdit = false;

	waitResponse: boolean = false;

	private_key: any = null;
	current_signer_action_ok: any = null;

    constructor(
    	private route: ActivatedRoute,
    	private router: Router,
    	private walletService: WalletService,
    	private userService: UserService,
    	private multiSignService: MultiSignService,
    	private t: TranslatePipe,
    ) {}

    ngOnInit() {
    	this.route.params.subscribe(params => {
           	let id_wallet = params.id ? params.id : '';
  			this.getUserWallet(id_wallet)
        });
        this.newWeight = this.userService.isSuperUser ? 25: 1;
    }

    async getUserWallet(id_wallet){
    	let data = {
    		id: id_wallet,
    		with_assets: true
    	}
    	let response = await this.walletService.getUserWallet(data);
    	if(!response.success){
    		return;
    	}
    	this.wallet = response.result;
    	this.signers = this.wallet.signers.filter((signer, index) => {
	      	return signer.public_key !== this.wallet.address;
	    }).map((signer, index) => {
	      	return {address: signer.public_key, weight: signer.weight};
	    });

	    this.masterKey = this.wallet.signers.filter( (signer, index) => {
	      	return signer.public_key === this.wallet.address;
	    }).map((signer, index) => {
	      	return {address: signer.public_key, weight: signer.weight};
	    })[0];

	    this.thresholds = this.wallet.thresholds;

	    // api result
	    this.typeList = [
	      	{
		        val: 1,
		        txt: this.t.transform('hot_wallet'),
		        class: "text-danger",
		        icons: "fa fa-fire",
		        des: "Hot wallet use to send money"
	      	},
	      	{
		        val: 2,
		        txt: this.t.transform('cold_wallet'),
		        class: "text-primary",
		        icons: "fa fa-snowflake-o",
		        des: "Cold wallet use to hold money"
	      	}
	    ];
	    this.typeList = this.typeList.filter(item => item.val != this.wallet.multisignType);
    }

    removeSigner(currentSigner) {
	    let signer = {address: currentSigner.address, weight: 0};
	    if (currentSigner.address === this.wallet.address) {

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
	            	// this.masterKey.weight = 0;
	            	this.OK(signer);
	            }
	        });
	    }
	    else {
	      	//update current singer to 0 to remove
	      	this.OK(signer);
    	}
  	}

  	OK(currentSigner){
	    if (!currentSigner.address)
	      	swal(
			  	'Signer is required!',
			  	'',
			  	'error'
			)
	    else {
	    	this.current_signer_action_ok = currentSigner;
	    	$('#privateKeyDialog').modal('show');
	    }
  	}

  	onPrivateKeyDialog(event){
  		this.private_key = event;
  		$('#tfaConfirmDialog').modal('show');
  	}

  	async onConfirmTfa(event){
  		let data = {
  			code: event,
  			sourceAddress: this.wallet.address,
            sourceKeys: [
                this.private_key.key1
            ],
            signers: [this.current_signer_action_ok],
            masterWeight: this.masterKey.weight,
            thresholds: {
                low: this.thresholds.low_threshold,
                med: this.thresholds.med_threshold,
                high: this.thresholds.high_threshold
            }
  		}
  		if (this.private_key.key2) data.sourceKeys.push(this.private_key.key2);
        if (this.private_key.key3) data.sourceKeys.push(this.private_key.key3);

        this.waitResponse = true;
  		let response = await this.multiSignService.settingMultiSignWalletForUser(data);
  		if(!response.success){
  			this.waitResponse = false;
  			swal(
			  	this.t.transform(errors[response.error.errorCode]),
			  	'',
			  	'error'
			)
  			return;
  		}
  		this.isSuccess = true;
  		let timer = setInterval(() => {
            this.timer--;
            if (this.timer == 0) {
              clearInterval(timer);
              this.router.navigate(['/wallet/multisign-wallet']);
            }
        }, 1000);
  	}

  	handleNewWeightInput(e, newWeight){
	    if (newWeight === undefined) this.newWeight = this.userService.isSuperUser ? 25: 1;
	    else {
	      	if (newWeight !== null && !Number.isInteger(newWeight)) this.newWeight = Math.floor(newWeight);
	      	else if (newWeight !== null && newWeight < 1) this.newWeight = this.userService.isSuperUser ? 25: 1;
	      	else if (newWeight !== null && this.userService.isSuperUser && newWeight > 100) this.newWeight = 100;
	      	else if (newWeight !== null && !this.userService.isSuperUser && newWeight > 10) this.newWeight = 10;
	    }
  	}

  	addSigner() {
	    this.newAddress = null;
	    this.newWeight = this.userService.isSuperUser ? 25 : 1;
	    this.isAddOrEdit = true;
  	}

  	editSigner(currentSigner) {
	    this.newAddress = currentSigner.address;
	    this.newWeight = currentSigner.weight;
	    this.isAddOrEdit = true;
  	}

  	undo(){
    	this.isAddOrEdit = false;
  	}
}

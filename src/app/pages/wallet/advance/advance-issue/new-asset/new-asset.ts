import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from './../../../../../@core/services/wallet.service';
import { MSWalletService } from './../../../../../@core/services/ms-wallet.service';
import { UploadFileService } from './../../../../../@core/services/upload-file.service';
import { AssetService } from './../../../../../@core/services/asset.service';
import { MSAssetService } from './../../../../../@core/services/ms-asset.service';
import { TranslatePipe } from './../../../../../@theme/pipes/translate.pipe';
import { errors } from './../../../../../@core/common/error-code';
import { Helper } from './../../../../../@core/common/helper';
import swal from 'sweetalert2';

declare var $: any;

@Component({
	selector: 'app-advance-new-asset',
    templateUrl: './new-asset.html',
    styleUrls: ['./new-asset.scss']
})

export class NewAssetAdvanceIssueComponent implements OnInit {

    @Output() on_new_asset_issue = new EventEmitter();
	@Input() issuer: any;
    @Input() myAssets: Array<any>;
    @Input() myWallets: Array<any>;

    processing = false;
    uploadSize = null;
    issuingWallet: any = null;
    holdingFeeWallet: any = null;
    prop = {AUTHORIZATION_REVOCABLE: true};
    assetName = null;
    assetRegex = new RegExp('([a-z]|[A-Z]|[0-9])*');
    decimalPlace = null;
    assetFee = null;
    decimalRegex = new RegExp('[0-7]?');
    ratio = null;
    ratioOptions: Array<any> = [];
    settingWalletProperty: boolean = false;
    assetLogo: any = null;
    isProcessingDisablePayment: boolean = false;


    options_wallet: any = null;
    selectTypeWallet: string = '';
    value_set_wallet_properties_dialog: any;
    assetChangeHoldingFeeWallet: any = null;
    options_disable_payment: any = null;
    setTypeConfirmTfa: string = '';
    assetDisablePaymentOfWallet: any = null;
    options_choose_signer: any = null;
    selectedSigner: any = null;
    setTypeChooseSignerDialog: string = '';

    msg_alert: string = '';
    type_alert: string = 'danger';
    date_now = Date.now();


    constructor(
        private router: Router,
        private walletService: WalletService,
        private assetService: AssetService,
        private uploadFileService: UploadFileService,
        private mSWalletService: MSWalletService,
        private mSAssetService: MSAssetService,
        private t: TranslatePipe,
    	private helper: Helper,
    ) {}

    ngOnInit() {
  
    }

    selectIssuingWallet(){
        this.selectTypeWallet = 'selectIssuing';
        this.options_wallet = {
            readyOnly: true,
            mode: 'multisign_wallet'
        };
        $('#walletAdvanceDialog').modal('show');
    }

    selectHoldingFeeWallet(){
        this.selectTypeWallet = 'selectHolding';
        this.options_wallet = {
            readyOnly: true,
            mode: 'all_wallet'
        };
        $('#walletAdvanceDialog').modal('show');
    }

    async onWalletAdvanceDialog(event){
        if(this.selectTypeWallet === 'selectIssuing'){
            if(this.issuingWallet && this.issuingWallet._id && this.issuingWallet.property === -1){
                this.assetLogo = null;
            }
            if (this.holdingFeeWallet && String(this.holdingFeeWallet._id) === String(event._id)){
                swal(
                    this.t.transform('ISSUING_WALLET_CANT_HOLDING_FEE_WALLET'),
                    '',
                    'warning'
                );
            }else{
                this.issuingWallet = event;
                this.ratioOptions = [
                    {
                        "value": "0", 
                        "label": this.t.transform('no_ratio')
                    }, 
                    {
                        "value": "1",
                        "label": "1/1"
                    }, 
                    {
                        "value": "10", 
                        "label": "1/10"
                    }, 
                    {
                        "value": "100", 
                        "label": "1/100"
                    }, 
                    {
                        "value": "1000",
                        "label": "1/1000"
                    }
                ];
            }
        }else if(this.selectTypeWallet === 'selectHolding'){
            if (String(this.issuingWallet._id) === String(event._id)){
                swal(
                    this.t.transform('ISSUING_WALLET_CANT_HOLDING_FEE_WALLET'),
                    '',
                    'warning'
                );
            }else{
                this.holdingFeeWallet = event;
            }
        }else if(this.selectTypeWallet === 'changeHoldingFee'){
            if (String(this.assetChangeHoldingFeeWallet.walletID._id) === String(event._id)) {
                swal(
                    this.t.transform('ISSUING_WALLET_CANT_HOLDING_FEE_WALLET'),
                    '',
                    'error'
                );
            }else {
                this.assetChangeHoldingFeeWallet.changingWallet = true;
                let dataChangeWallet = {
                    assetId: this.assetChangeHoldingFeeWallet._id,
                    newWalletID: event._id
                };
                let response = await this.mSAssetService.changeHoldingFeeWalletMultisign(dataChangeWallet);
                this.assetChangeHoldingFeeWallet.changingWallet = false;
                if(!response.success){
                    swal(
                       this.t.transform(errors[response.error.errorCode]),
                        '',
                        'error'
                    );
                    return;
                }
                for(let i = 0; i < this.myAssets.length; i++) {
                    if (String(this.myAssets[i]._id) === String(this.assetChangeHoldingFeeWallet._id)) {
                      this.myAssets[i].receiveFeeWalletID = event;
                    }
                }
            }
        }
    }

    setIssuingWalletProperty(){
        $('#setWalletPropertiesDialog').modal('show');
    }

    onSetWalletPropertiesDialog(event){
        this.value_set_wallet_properties_dialog = event;
        this.setTypeChooseSignerDialog = "onSetWalletPropertiesDialog";
        this.options_choose_signer = {signers: this.issuingWallet.signers};
        $('#chooseSignerDialog').modal('show');
    }

    async onConfirmTfa(event){
        if(this.setTypeChooseSignerDialog === "onSetWalletPropertiesDialog"){
            this.settingWalletProperty = true;
            let data = {
                code: event,
                property: this.value_set_wallet_properties_dialog,
                walletAddress: this.issuingWallet.address,
                sourceAddress: this.selectedSigner.public_key,
            }
            let response = await this.mSWalletService.setMultiSignWalletProperty(data);
            this.settingWalletProperty = false;
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
                    this.t.transform('setting_property_was_successfully'),
                    '',
                    'success'
                );
                this.issuingWallet.property = this.value_set_wallet_properties_dialog;
            }
            else if (response.result.status == 2) {
                swal(
                    this.t.transform('transaction_submit_fail'),
                    '',
                    'error'
                );
                this.router.navigate(['/wallet/advance-transaction/', response.result._id])
            }
            else {
                this.router.navigate(['/wallet/advance-transaction/', response.result._id])
            }
        }else if(this.setTypeChooseSignerDialog === "onDisablePaymentDialog"){
            this.callAPIDisableWallet(this.assetDisablePaymentOfWallet, event);
        }
    }

    onChooseSignerDialog(event){
        this.selectedSigner = event;
        $('#tfaConfirmDialog').modal('show');
    }


    async callAPIDisableWallet(asset, tfaCode){
        this.isProcessingDisablePayment = true;
        let data = {
            code: tfaCode,
            walletAddress: asset.walletID.address,
            sourceAddress: this.selectedSigner.public_key
        };
        let response = await this.mSWalletService.disablePaymentOfSharedWallet(data);
        this.isProcessingDisablePayment = false;
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.on_new_asset_issue.emit();
        if (response.result.status == 1) {
            swal(
                this.t.transform('disable_issuing_successfully'),
                '',
                'success'
            );
        } else if (response.result.status == 2) {
            swal(
                this.t.transform('transaction_submit_fail'),
                '',
                'error'
            );
            this.router.navigate(['/wallet/advance-transaction/', response.result._id])
        }
        else {
            this.router.navigate(['/wallet/advance-transaction/', response.result._id])
        }
    }

    showAssetPropertiesDialog(){
        $('#assetPropertiesDialog').modal('show');
    }

    onAssetPropertiesDialog(){

    }

    checkDecimalPlace(value) {
        let result = this.decimalRegex.exec(value);
        let get_val = result[0] == '' ? '' : result[0];
        $('#decimal-place').val(get_val);
        this.decimalPlace = get_val;
        this.checkAssetFee(this.assetFee);
    }

    checkAssetName(value) {
        let result = this.assetRegex.exec(value);
        let get_val = result[0] == '' ? '' : result[0];
        $('#asset-name').val(get_val);
        this.assetName = get_val;
    }

    checkAssetFee(value) {
        let feeRegex = new RegExp('[0-9]*\\.?[0-9]{0,' + this.decimalPlace + '}');
        let result = feeRegex.exec(value);
        let get_val = result[0] == '' ? '' : result[0];
        $('#asset-fee').val(get_val);
        this.assetFee = get_val;
    }

    changeAssetLogo(asset) {
        $('#file-input-' + asset._id).trigger('click');
    }

    async uploadAssetLogo(event, asset) {
        if (event.target && event.target.files && event.target.files.length && event.target.files[0].size < 2097152) {
            this.uploadSize = event.target.files[0].size;
            asset.isLogoBeingChanged = true;
            //-- request for url
            let response = await this.assetService.updateAssetLogo({assetId: asset._id});
            if(!response.success){
                asset.isLogoBeingChanged = false;
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
                return;
            }
            this.uploadFileService.uploadImages(response.result.uploadUrl,  event.target.files[0]).subscribe(
                (result) => {
                    asset.logo = response.result.newLogo;
                    let reader: any = new FileReader();
                    reader.onload = (e: any) => {
                        $('#asset-logo-'+asset._id).attr('src', e.target.result);
                    };
                    reader.readAsDataURL(event.target.files[0]);
                    $('#asset-name-' + asset._id).hide();
                    asset.isLogoBeingChanged = false;
                },
                (error) => {
                    asset.isLogoBeingChanged = false;
                }
            );
            
        }
    }

    async createAsset() {
        this.processing = true;
        let data = {
            address: this.issuingWallet.address,
            assetName: this.assetName,
            decimalPlace: this.decimalPlace,
            assetFee: this.assetFee,
            ratio: this.ratio
        };
        let response = await this.mSAssetService.createAssetMultisign(data);
        this.processing = false;
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.uploadFileService.uploadImages(response.extra.uploadUrl, this.assetLogo).subscribe(
            (res_upload) => {
                swal(
                    this.t.transform('SUCCESS'),
                    '',
                    'success'
                );
                this.complete(response.result);
            },
            (error) => {
                swal(
                    this.t.transform('CREATE_ASSET_WITHOUT_LOGO'),
                    '',
                    'error'
                );
                this.complete(response.result);
            }
        );
       
    }

    async complete(asset){
        let walletID = this.issuingWallet._id;
        this.processing = false;
        this.issuingWallet = null;
        this.prop = null;
        this.assetName = null;
        this.myAssets.push(asset);
        //-- refresh wallet\
        let data = {
            id: walletID, 
            with_assets: true
        }
        let response = await this.walletService.getUserWallet(data);
        if(!response.success){
            return;
        }
        this.myWallets.some((wallet, index) => {
            if (String(wallet._id) === walletID) {
              this.myWallets[index] = response.result;
              return true;
            }
        });
    }

    changeHoldingFeeWallet(asset) {
        this.assetChangeHoldingFeeWallet = asset;
        this.selectTypeWallet = 'changeHoldingFee';
        this.options_wallet = {
            readyOnly: true, 
            mode: 'all_wallet'
        };
        $('#walletAdvanceDialog').modal('show');
    }

    disablePaymentOfWallet(asset){
        this.assetDisablePaymentOfWallet = {...asset};
        this.options_disable_payment = {asset};
        $('#disablePaymentDialog').modal('show');
    }

    onDisablePaymentDialog(){
        this.setTypeChooseSignerDialog = "onDisablePaymentDialog";
      this.options_choose_signer = {signers: this.assetDisablePaymentOfWallet.walletID.signers}
        $('#chooseSignerDialog').modal('show');
    }

    onFileChangeAssetLogo(event){
        if(event.target.files && event.target.files.length > 0) {
            let file: any = event.target.files[0];
            let reader: any = new FileReader();
            reader.onload = (e: any) => {
                $('#show-asset-logo').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
            this.assetLogo = file;
        }
    }

    currencyDigitsInfo(decimalPlace){
    	return `1.${decimalPlace}`;
    }

}

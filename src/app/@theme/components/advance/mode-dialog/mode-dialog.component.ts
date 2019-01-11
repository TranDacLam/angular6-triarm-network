import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { AssetService } from './../../../../@core/services/asset.service';
import { IssuerService } from './../../../../@core/services/issuer.service';
import { Helper } from './../../../../@core/common/helper';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-mode-advance-dialog',
    templateUrl: './mode-dialog.component.html',
    styleUrls: ['./mode-dialog.component.scss']
})

export class ModeAdvanceDialogComponent implements OnInit, OnChanges {

    @Output() on_untrust_asset_from_mode_dialog = new EventEmitter();
    @Output() on_confirm_trust_from_mode_dialog = new EventEmitter();
    @Input() options: any;

    walletModeDialog: any = null;
    currency: any = null;
    mode: string = '';
    issuer = null;
    dataFee = null;
    getInfo = true;
    isHoldingFeeWallet = false;
    balance: number = null;

    loading: boolean = true;
    asset: string = '';
    isTrustAccepted: boolean;

    constructor(
        private router: Router,
        private assetService: AssetService,
        private issuerService: IssuerService,
        private helper: Helper,
        private t: TranslatePipe,
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(){
        if(this.options){
            this.walletModeDialog = this.options.walletModeDialog;
            this.currency = this.options.currency;
            this.balance = this.currency.balance;
            this.mode = this.options.mode;
            this.asset = this.currency.asset_type === 'native' ? 'native' : this.currency.asset_code;
            this.isTrustAccepted = this.getAssetStatus(this.currency, this.walletModeDialog.lastRequestTrustAsset) === 3;
            if(this.currency.asset_type !== "native"){
                this.getInfo = true;
                this.getAsset();
            }else{
                this.getInfo = false;
                this.loading = false;
            }
        }
    }

    goto(where){
        return this.router.navigate(['/wallet/advance/payment', {mode: where, wallet: this.walletModeDialog._id, asset: this.asset, amount: this.balance}]);
    }

    getAssetStatus(asset, lastRequestTrustAsset) {
        let assetStatus = 3;
        if (!asset || !lastRequestTrustAsset || lastRequestTrustAsset.length === 0)
            return assetStatus;
        for (var i = 0; i < lastRequestTrustAsset.length; i++) {
            if (asset._id === lastRequestTrustAsset[i].requestID.assetID)
                assetStatus = lastRequestTrustAsset[i].requestID.status;
        }
        return assetStatus;
    };

    async getAsset(){
        let data = {
            id: this.currency._id
        }
        let response = await this.assetService.getAsset(data);
        if(!response.success){
            return;
        }
        let dataIssue = {
            issuerId: response.result.issuerID._id
        }
        this.isHoldingFeeWallet = response.result.receiveFeeWalletID && response.result.receiveFeeWalletID._id === this.walletModeDialog._id;
        this.dataFee = {
            fee:response.result.fee,
            decimalPlace:response.result.decimalPlace,
            capital:response.result.capital,
            issuerAddress:response.result.walletID.address,
            isLimitIssuing: !!(response.result.walletID.extraFlags & 0x01)
        };
        let response_issuer = await this.issuerService.getIssuerInfo(dataIssue);
        this.loading = false;
        if(!response_issuer.success){
            return;
        }
        this.issuer = response_issuer.result;
    }

    confirmUntrust(){
        swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('are_you_sure'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('ok_'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                let data = {
                    assetCode: this.asset,
                    wallet: this.walletModeDialog,
                    assetID: this.currency._id
                }
                this.on_untrust_asset_from_mode_dialog.emit(data);
                $('#modeAdvanceDialog').modal('hide');
            }
        });
    }

    confirmTrust(){
        $('#modeAdvanceDialog').modal('hide');
        this.on_confirm_trust_from_mode_dialog.emit();
    }

}

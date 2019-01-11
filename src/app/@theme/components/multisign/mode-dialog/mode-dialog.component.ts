import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { AssetService } from './../../../../@core/services/asset.service';
import { IssuerService } from './../../../../@core/services/issuer.service';
import { errors } from './../../../../@core/common/error-code';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe'
import swal from 'sweetalert2';

@Component({
    selector: 'app-mode-multisign-dialog',
    templateUrl: './mode-dialog.component.html',
    styleUrls: ['./mode-dialog.component.scss']
})

export class ModeMultiSignDialogComponent implements OnInit, OnChanges {

    @Output() valueChange = new EventEmitter();
    @Input() walletModeDialog: any;
    @Input() currency: any;
    issuer = null;
    dataFee = null;
    getInfo = true;
    isHoldingFeeWallet = false;

    loading: boolean = true;
    asset: string = '';
    isTrustAccepted: boolean;

    constructor(
        private router: Router,
        private assetService: AssetService,
        private issuerService: IssuerService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(){
        if(this.currency && this.walletModeDialog){
            this.asset = this.currency.asset_type === 'native' ? 'native' : this.currency.asset_code;
            this.isTrustAccepted = this.getAssetStatus(this.currency, this.walletModeDialog.lastRequestTrustAsset) === 3;
            this.loading = false;
            if(this.currency.asset_type !== "native"){
                this.getInfo = true;
                this.getAsset();
            }else{
                this.getInfo = false;
            }
        }
    }

    goto(where){
        return this.router.navigate(['/admin/multisign/transaction', {mode: where, wallet: this.walletModeDialog._id, asset: this.asset}]);
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
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
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
            issuerAddress:response.result.walletID.address
        };
        let response_issuer = await this.issuerService.getIssuerInfo(dataIssue);
        if(!response_issuer.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.issuer = response_issuer.result;
        this.loading = false;
    } 
}

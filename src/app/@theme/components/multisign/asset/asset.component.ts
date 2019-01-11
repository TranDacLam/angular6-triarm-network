import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-asset-multisign',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.scss']
})

export class AssetMultiSignComponent implements OnInit {

	@Input() selectedWallet: any;
    @Input() currentSelectAssetID: string;
	assetStatus: any = {
        STATUS_PENDING: 1,
        STATUS_REJECTED: 2,
        STATUS_ACCEPTED: 3
    };
    wallet: any;
    balance_detail: any;

    constructor(
    ) {
    }

    ngOnInit() {
    }

    getAssetStatus(asset, lastRequestTrustAsset) {
	    let assetStatus = 3;
        if (!asset || !lastRequestTrustAsset || lastRequestTrustAsset.length === 0)
            return assetStatus;
        for (let i = 0; i < lastRequestTrustAsset.length; i ++) {
            if (asset._id === lastRequestTrustAsset[i].requestID.assetID)
                assetStatus = lastRequestTrustAsset[i].requestID.status;
        }
        return assetStatus;
    };

    currencyDigitsInfo(decimalPlace){
    	return `1.${decimalPlace}`;
    }

    openModeDialog(wallet, balance_detail){
        this.wallet = wallet;
        this.balance_detail = balance_detail;
        $('#modeDialogMultiSign').modal('show');
    }

    addTrustLine(wallet){
        wallet
    }

    onError(event, item){
        let index = this.selectedWallet.balances.findIndex(balance => {
            return balance._id === item._id;
        });
        if(index >= 0){
            this.selectedWallet.balances[index]['isErrorImage'] = true;
        }
    }
}

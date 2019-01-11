import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { MultiSignUserService } from './../../../@core/services/multi-sign-user.service';
import { WalletService } from './../../../@core/services/wallet.service';
import { AssetService } from './../../../@core/services/asset.service';
import { errors } from './../../../@core/common/error-code';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';
import { Helper } from './../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-asset',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.scss']
})

export class AssetComponent implements OnInit {

	@Input() selectedWallet: any;
    @Input() wallets: Array<any>;

	assetStatus: any = {
        STATUS_PENDING: 1,
        STATUS_REJECTED: 2,
        STATUS_ACCEPTED: 3
    };
    wallet: any;
    balance_detail: any;
    signers: any = null;
    dataUntrustAssetFromModeDialog: any = null;
    tfaMatch: boolean;
    currentSelectAssetID: string = '';
    options_asset: any = null;
    typeConfirmTfa: string = '';
    dataAssetDialog: any = null;
    mode: string = '';

    constructor(
        private multiSignUserService: MultiSignUserService,
        private walletService: WalletService,
        private assetService: AssetService,
        private router: Router,
        private t: TranslatePipe,
        public helper: Helper
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
        this.mode = '';
        this.wallet = wallet;
        this.balance_detail = balance_detail;
        $('#modeDialog').modal('show');
    }

    onError(event, item){
        let index = this.selectedWallet.balances.findIndex(balance => {
            return balance._id === item._id;
        });
        if(index >= 0){
            this.selectedWallet.balances[index]['isErrorImage'] = true;
        }
    }

    onUntrustAssetFromModeDialog(event){
        this.dataUntrustAssetFromModeDialog = event;
        this.currentSelectAssetID = event.assetID;
        this.typeConfirmTfa = "unTrustLine";
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        if(this.typeConfirmTfa === "unTrustLine"){
            let data = {
                code: event,
                assetCode: this.dataUntrustAssetFromModeDialog.assetCode,
                walletID: this.dataUntrustAssetFromModeDialog.wallet._id
            };
            let response = await this.assetService.unTrustAsset(data);
            if(!response.success){
                this.tfaMatch = false;
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
                return;
            }
            this.tfaMatch = true;
            this.currentSelectAssetID = '';
            let data_wallet = {
                id: this.dataUntrustAssetFromModeDialog.wallet._id,
                with_assets: true
            }
            let response_wallet = await this.walletService.getUserWallet(data_wallet);;
            if(!response_wallet.success){
                return this.router.navigate(['/wallet/my-wallets']);
            }
            this.wallets.forEach((w, index) => {
                if (String(w._id) === String(this.dataUntrustAssetFromModeDialog.wallet._id)) {
                    this.wallets[index].balances = response_wallet.result.balances;
                    this.wallets[index].lastRequestTrustAsset = response_wallet.result.lastRequestTrustAsset;
                    return true;
                }
            });
        }else if(this.typeConfirmTfa === "addTrustLine"){
            let selectedAsset = this.dataAssetDialog.selectedAsset;
            if (selectedAsset.asset_type === 'native') {
                setTimeout(() => {
                    swal(
                        this.t.transform('NATIVE_ASSET_TRUST_BY_DEFAULT'),
                        '',
                        'error'
                    );
                }, 500);
            }else{
                let data = {
                    code: event,
                    assetCode: selectedAsset.asset_code || selectedAsset.name,
                    receivingWalletID: this.selectedWallet._id
                };
                this.selectedWallet.addingTrustLine = true;
                let response = await this.assetService.createTrustLine(data);
                if(!response.success){
                    this.selectedWallet.addingTrustLine = false;
                    swal(
                        this.t.transform(errors[response.error.errorCode]),
                        '',
                        'error'
                    );
                    return;
                }
                let data_wallet = {
                    id: this.selectedWallet._id, 
                    with_assets: true
                };
                let response_wallet = await this.walletService.getUserWallet(data_wallet);
                this.selectedWallet.addingTrustLine = false;
                if(!response_wallet.success){
                    return this.router.navigate(['/wallet/my-wallets']);
                }
                this.wallets.forEach((w, index) => {
                    if (String(w._id) === String(this.selectedWallet._id)) {
                        this.wallets[index].balances = response_wallet.result.balances;
                        this.wallets[index].lastRequestTrustAsset = response_wallet.result.lastRequestTrustAsset;
                        return true;
                    }
                });
            }
        }   
    }
    addTrustLine(){
        this.typeConfirmTfa = "addTrustLine";
        this.options_asset = {
            mode: "buy", 
            ownedAssets: true, 
            otherAssets: true
        }
        $('#assetDialog').modal('show');
    }

    onAssetDialog(event){
        this.dataAssetDialog = event;
        this.mode = 'preview';
        this.wallet = this.selectedWallet;
        this.balance_detail = event.selectedAsset;
        $('#modeDialog').modal('show');
    }

    onConfirmModeDialog(){
        $('#tfaConfirmDialog').modal('show');
    }
}

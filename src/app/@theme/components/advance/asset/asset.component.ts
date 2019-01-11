import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from './../../../../@core/services/wallet.service';
import { MSAssetService } from './../../../../@core/services/ms-asset.service';
import { Helper } from './../../../../@core/common/helper';
import { errors } from './../../../../@core/common/error-code';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-asset-advance',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.scss']
})

export class AssetAdvanceComponent implements OnInit {

	@Input() selectedWallet: any;
    @Input() wallets: any;
    @Input() isSelectedWalletNotAvailable: boolean;

	assetStatus: any = {
        STATUS_PENDING: 1,
        STATUS_REJECTED: 2,
        STATUS_ACCEPTED: 3
    };

    currentSelectAssetID: string = '';
    options_asset: any = null;
    options_choose_signer: any = null;

    wallet_add_trust_line: any = null;
    selectedAsset: any = null;
    selectedSigner: any = null;
    typeOnConfirmTfa: string = '';
    valueUntrustAssetFromModeDialog: any = null;
    tfaMatch: boolean;
    options_mode_dialog: any = null;

    constructor(
        private router: Router,
        private walletService: WalletService,
        private mSAssetService: MSAssetService,
        private helper: Helper,
        private t: TranslatePipe
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
        this.options_mode_dialog = {
            walletModeDialog: wallet,
            currency: balance_detail,
            mode: ''
        }
        $('#modeAdvanceDialog').modal('show');
    }

    addTrustLine(wallet){
        this.wallet_add_trust_line = wallet;
        this.options_asset = {
            mode: 'buy',
            ownedAssets: true, 
            otherAssets: true
        };
        $('#assetDialogMultiSign').modal('show');
    }

    onAssetDialog(event){
        this.selectedAsset = event;
        this.options_mode_dialog = {
            walletModeDialog: this.wallet_add_trust_line,
            currency: event.selectedAsset,
            mode: 'preview'
        }
        this.typeOnConfirmTfa = 'onAssetDialog';
        $('#modeAdvanceDialog').modal('show');
    }

    onConfirmTrustFromModeDialog(){
        this.options_choose_signer = {signers: this.wallet_add_trust_line.signers};
        $('#chooseSignerDialog').modal('show');
    }

    onChooseSignerDialog(event){
        this.selectedSigner = event;
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        if(this.typeOnConfirmTfa === 'onAssetDialog'){
            const asset = this.selectedAsset.selectedAsset;
            if (asset.asset_type === 'native') {
                setTimeout(() => {
                    swal(
                        this.t.transform('NATIVE_ASSET_TRUST_BY_DEFAULT'),
                        '',
                        'error'
                    )
                }, 500);
            }else{
                const data_create_trust_line = {
                    code: event,
                    assetCode: asset.asset_code || asset.name,
                    sourceAddress: this.selectedSigner.public_key,
                    walletAddress: this.wallet_add_trust_line.address,
                };
                this.wallet_add_trust_line.addingTrustLine = true;
                let response = await this.mSAssetService.createTrustLineMultiSign(data_create_trust_line);
                if(!response.success){
                    this.wallet_add_trust_line.addingTrustLine = false;
                    swal(
                        this.t.transform(errors[response.error.errorCode]),
                        '',
                        'error'
                    )
                    return;
                }
                let data_wallet = {
                    id: this.wallet_add_trust_line._id, 
                    with_assets: true
                };
                let response_wallet = await this.walletService.getUserWallet(data_wallet);
                if(!response_wallet.success){
                    this.wallet_add_trust_line.addingTrustLine = false;
                    this.router.navigate(['/wallet/advance-wallet']);
                    return;
                }
                this.wallet_add_trust_line.addingTrustLine = false;
                this.wallets.forEach((w, index) => {
                    if (String(w._id) === String(this.wallet_add_trust_line._id)) {
                        this.wallets[index].balances = response_wallet.result.balances;
                        this.wallets[index].lastRequestTrustAsset = response_wallet.result.lastRequestTrustAsset;
                        return true;
                    }
                });

            }
        }else if(this.typeOnConfirmTfa === 'onUntrustAssetFromModeDialog'){
            let data = {
                walletAddress: this.valueUntrustAssetFromModeDialog.wallet.address,
                sourceAddress: this.selectedSigner.public_key,
                assetCode: this.valueUntrustAssetFromModeDialog.assetCode,
                code: event,
            }
            let response = await this.mSAssetService.untrustMultiSign(data);
            if(!response.success){
                this.tfaMatch = false;
                this.currentSelectAssetID = '';
                return;
            }
            if (response.result.status == 1) {
                swal(
                    this.t.transform('untrust_asset_successfully'),
                    '',
                    'success'
                );
                this.tfaMatch = true;
                this.currentSelectAssetID = '';
                let data_wallet = {
                    id: this.valueUntrustAssetFromModeDialog.wallet._id, 
                    with_assets: true
                };
                let response_wallet = await this.walletService.getUserWallet(data_wallet);
                if(!response_wallet.success){
                    return this.router.navigate(['/wallet/advance-wallet']);
                }
                this.wallets.forEach((w, index) => {
                    if (String(w._id) === String(this.valueUntrustAssetFromModeDialog.wallet._id)) {
                        this.wallets[index].balances = response_wallet.result.balances;
                        this.wallets[index].lastRequestTrustAsset = response_wallet.result.lastRequestTrustAsset;
                        return true;
                    }
                });
            }if (response.result.status == 2) {
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

    }

    onUntrustAssetFromModeDialog(event){
        this.valueUntrustAssetFromModeDialog = event;
        this.typeOnConfirmTfa = 'onUntrustAssetFromModeDialog';
        this.currentSelectAssetID = event.assetID;
        this.options_choose_signer = {signers: event.wallet.signers};
        $('#chooseSignerDialog').modal('show');
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

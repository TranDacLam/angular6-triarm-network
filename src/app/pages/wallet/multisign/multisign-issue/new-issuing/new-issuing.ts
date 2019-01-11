import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IssuerService } from './../../../../../@core/services/issuer.service';
import { AssetService } from './../../../../../@core/services/asset.service';
import { WalletService } from './../../../../../@core/services/wallet.service';
import { MultiSignUserService } from './../../../../../@core/services/multi-sign-user.service';
import { Helper } from './../../../../../@core/common/helper';
import { TranslatePipe } from './../../../../../@theme/pipes/translate.pipe';
import { errors } from './../../../../../@core/common/error-code';
import swal from 'sweetalert2';
import { BigNumber } from 'bignumber.js';

declare var $: any;

@Component({
	selector: 'app-new-issuing-multisign-user',
    templateUrl: './new-issuing.html',
    styleUrls: ['./new-issuing.scss']
})

export class NewIssuingMultisignUserIssueComponent implements OnInit {

    @Output() on_replace_item_new_issuing = new EventEmitter();
	@Input() issuer: any;
    @Input() myAssets: Array<any>;
    @Input() myWallets: Array<any>;

    issuingWallet: any= null;
    issuingAsset: any = null;
    holdingWallet: any = null;
    issuingAmount: any = null;
    processing = false;
    loadingIssuingHistory: boolean = false;

    issuingAmountRegex: any;
    options_asset: any = null;
    options_wallet: any = null;
    signers: any = null;

    constructor(
        private issuerService: IssuerService,
        private assetService: AssetService,
        private walletService: WalletService,
        private multiSignUserService: MultiSignUserService,
    	private helper: Helper,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
    }

    selectIssuingAsset(){
        this.options_asset = {
            mode: "issue", 
            ownedOnly: true, 
            withoutAdvance: false,
            multisign_user: true
        };
        $('#assetDialogMultiSignUser').modal('show');
    }

    onAssetDialog(event){
        if (!this.issuingAsset || (this.issuingAsset._id !== event.selectedAsset._id)) {
            this.issuingAmount = null;
            //-- use the asset in $scope.myAssets so we can listen to img change event
            for (let i = 0; i < this.myAssets.length; i++) {
                if (String(this.myAssets[i]._id) === String(event.selectedAsset._id)) {
                    this.issuingAsset = this.myAssets[i];
                  this.issuingAsset['isErrorImage'] = event.selectedAsset.isErrorImage;
                    break;
                }
            }
            for (let i = 0; i < this.myWallets.length; i++) {
              if (String(this.myWallets[i]._id) === String(this.issuingAsset.issuingWalletID)) {
                this.issuingWallet = this.myWallets[i];
                break;
              }
            }
            this.issuingAmountRegex = new RegExp('[0-9]*[.]?[0-9]{0,' + this.issuingAsset.decimalPlace + '}');

            //-- reload issuing History
            if (!this.issuingAsset.history) {
                this.reloadIssuingHistory();
            }
        }
    }

    async reloadIssuingHistory() {
        if (this.issuingAsset && this.issuingAsset._id) {
            this.loadingIssuingHistory = true;
            let data = {
                assetId: this.issuingAsset._id
            }
            let response = await this.issuerService.getIssuingHistory(data);
            this.loadingIssuingHistory = false;
            if(!response.success){
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
                return;
            }
            this.issuingAsset.history = response.result.map(history => {
                history.holdingWalletURL = this.getHoldingWalletLink(history.holdingWalletID);
                return history;
            });
        }
    }

    getHoldingWalletLink(holdingWallet) {
        if (!holdingWallet) return '';
        if (!holdingWallet.type) {
            return 'my-wallets?walletId=' + holdingWallet._id;
        } else if (holdingWallet.multisignType === 0) {
            return 'advance-wallet?walletId=' + holdingWallet._id;
        } else {
            return 'multisign-wallet?walletId=' + holdingWallet._id;
        }
    }

    getARMRequired() {
        if (this.issuingAmount) {
            BigNumber.config({DECIMAL_PLACES: 7});
            return (new BigNumber(this.issuingAmount)).multipliedBy(new BigNumber(this.issuingAsset.ratio)).toString(10);
        }
        return '';
    }

    checkIssuingAmount(value) {
        let result = this.issuingAmountRegex.exec(value);
        let get_val = result[0] == '' ? '' : result[0];
        $('#issuing-amount').val(get_val);
        this.issuingAmount = get_val;
    }

    selectHoldingWallet() {
        this.options_wallet = {
            readyOnly: true,
            issue: true
        };
        $('#walletDialogMultiSignUser').modal('show');
    }

    onWalletDialog(event){
        if (this.issuingAsset && this.issuingAsset.asset_issuer === event.address) {
            swal(
                this.t.transform('CANT_ISSUE_MONEY_TO_ISSUING_WALLET'),
                '',
                'error'
            );
        }
        else {
            this.holdingWallet = event;
        }
    }

    issue(){
        $('#privateKeyDialog').modal('show');
    }

    onPrivateKeyDialog(event){
        this.signers = {
            signer1: event.key1,
            signer2: event.key2,
            signer3: event.key3
        }
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        this.processing = true;
        let data = {
            assetId: this.issuingAsset._id,
            holdingWalletId: this.holdingWallet._id,
            issuingAmount: Number(this.issuingAmount),
            signers: [this.signers.signer1],
            code: event
        };
        if(this.signers.signer2) data.signers.push(this.signers.signer2);
        if(this.signers.signer3) data.signers.push(this.signers.signer3);

        let response = await this.multiSignUserService.issuingAssetMultiSignForUser(data);
        this.processing = false
        if(!response.success){
            if(response.error.errorCode == 25){
                switch (response.extra) {
                    case 'tx_insufficient_balance':
                        swal(
                            this.t.transform('ISSUING_WALLET_OR_HOLDING_WALLET_NOT_ENOUGH_ARM'),
                            '',
                            'error'
                        );
                        break;
                    case 'changeTrustLowReserve':
                        swal(
                            this.t.transform('NEED_MORE_MONEY_HOLDING_WALLET_TRUST_NEW_ASSET'),
                            '',
                            'error'
                        );
                        break;
                    default:
                        swal(
                            `${this.t.transform('NEED_MORE_MONEY_HOLDING_WALLET_TRUST_NEW_ASSET')} (${response.extra})`,
                            '',
                            'error'
                        );
                }
            }else{
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
            }
            return;
        }
        //-- clear fields
        let issuingWalletID = this.issuingAsset.walletID._id;
        let holdingWalletID = this.holdingWallet._id;
        this.holdingWallet = null;
        this.issuingAmount = null;
        this.issuingAsset.history.push(response.result);
        this.getUserWalletIssuing(issuingWalletID);
        this.getUserWalletHolding(holdingWalletID);
        this.getAsset();
    }

    async getUserWalletIssuing(issuingWalletID){
        let data = {
            id: issuingWalletID,
            with_assets: true
        };
        let response = await this.walletService.getUserWallet(data);
        if(!response.success){
            return;
        }
        let data_emit = {
            array: this.myWallets, 
            id: issuingWalletID, 
            newValue: response.result
        }
        this.on_replace_item_new_issuing.emit(data_emit);
    }

    async getUserWalletHolding(holdingWalletID){
        let data = {
            id: holdingWalletID,
            with_assets: true
        };
        let response = await this.walletService.getUserWallet(data);
        if(!response.success){
            return;
        }
        let data_emit = {
            array: this.myWallets, 
            id: holdingWalletID, 
            newValue: response.result
        }
        this.on_replace_item_new_issuing.emit(data_emit);
    }

    async getAsset(){
        let data = {
            id: this.issuingAsset._id, 
            rawData: true
        };
        let response = await this.assetService.getAsset(data);
        if(!response.success){
            return;
        }
        let data_emit = {
            array: this.myAssets, 
            id: this.issuingAsset._id, 
            newValue: response.result
        }
        this.on_replace_item_new_issuing.emit(data_emit);
        this.issuingAsset = response.result;
    }

    currencyDigitsInfo(decimalPlace){
    	return `1.${decimalPlace}`;
    }

}

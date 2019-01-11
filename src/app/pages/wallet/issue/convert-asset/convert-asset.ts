import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Helper } from './../../../../@core/common/helper';
import { IssuerService } from './../../../../@core/services/issuer.service';
import { AssetService } from './../../../../@core/services/asset.service';
import { WalletService } from './../../../../@core/services/wallet.service';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';
import { BigNumber } from 'bignumber.js';

declare var $: any;

@Component({
	selector: 'app-convert-asset',
    templateUrl: './convert-asset.html',
    styleUrls: ['./convert-asset.scss']
})

export class ConvertAssetIssueComponent implements OnInit {

    @Output() on_replace_item_convert = new EventEmitter();
	@Input() issuer: any;
    @Input() myAssets: Array<any>;
    @Input() myWallets: Array<any>;

    convertAsset: any = null;
    processing: boolean = false;
    options_asset: any = null;
    convertWallet: any = null;
    convertAmount: any = null;
    filteredWallets: Array<any> = [];
    totalBalance: any = null;

    NUMBER_REGEX = new RegExp('[1-9]+.?[0-9]*');
    date_now = Date.now();

    constructor(
        private issuerService: IssuerService,
        private walletService: WalletService,
        private assetService: AssetService,
    	private helper: Helper,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
    }

    selectConvertWallet(wallet) {
        if (!this.processing) {
            this.convertWallet = wallet;
            this.convertAmount = null;
        }
    }

    selectConvertAsset(){
        this.options_asset = {
            mode: "issue", 
            ownedOnly: true
        };
        $('#assetDialog').modal('show');
    }

    onAssetDialog(event){
        this.reloadSelectedAsset(event.selectedAsset._id);
    }

    reloadSelectedAsset(assetId) {
        //-- use global model
        this.convertAmount = null;
        this.convertWallet = null;
        for (var i = 0; i < this.myAssets.length; i++) {
            if (String(this.myAssets[i]._id) === String(assetId)) {
                this.convertAsset = this.myAssets[i];
                break;
            }
        }
        // ctrl.convertAsset = $scope.myAssets.find(function (a) {
        //  return a._id === assetId;
        // });
        BigNumber.config({DECIMAL_PLACES: this.convertAsset.decimalPlace});

        //-- filter all wallets that contain the asset
        this.filteredWallets = [];
        this.totalBalance = new BigNumber(0);
        this.myWallets.forEach((wallet) => {
          if (wallet.balances)
            wallet.balances.forEach((balance) => {
              if ((balance.asset_code === this.convertAsset.name) && (new BigNumber(balance.balance).isGreaterThan(0))) {
                this.totalBalance = this.totalBalance.plus(new BigNumber(balance.balance));
                this.filteredWallets.push(wallet);
              }
            });
        });
    }

    getTokenBalance(wallet, asset) {
        let result = 0;
        if (wallet && asset && wallet.balances) {
            wallet.balances.some((balance) => {
                if (balance.asset_code === asset.name) {
                    result = balance.balance;
                    return true;
                }
            });
        }
        return result;
    }

    changeConvertAmount() {
        let regexResult = this.NUMBER_REGEX.exec(this.convertAmount);
        this.convertAmount = regexResult ? regexResult[0] : null;
        if (this.convertAmount) {
          let desiredAmount = new BigNumber(this.convertAmount);
          let maxAmount = new BigNumber(this.getTokenBalance(this.convertWallet, this.convertAsset));
          if (desiredAmount.isGreaterThan(maxAmount))
            this.convertAmount = maxAmount.toString(10);
        }
    }

    getRefundAmount(convertAmount) {
        if (convertAmount) {
            BigNumber.config({DECIMAL_PLACES: 7});
            return new BigNumber(convertAmount).multipliedBy(new BigNumber(this.convertAsset.ratio)).toString(10);
        }
    }

    convertAssetToNative(){
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        this.processing = true;
        let data = {
            assetId: this.convertAsset._id,
            sourceWalletID: this.convertWallet._id,
            amount: this.convertAmount,
            code: event
        };
        let response = await this.issuerService.convertAssetBack(data);
        this.processing = false;
        if(!response.success){
            return;
        }
        this.convertAmount = null;
        swal(
            this.t.transform('SUCCESS'),
            '',
            'success'
        );
        this.getUserWalletConvertAsset();
        this.getUserWalletConvertWallet();
        this.getAsset();
        this.reloadSelectedAsset(this.convertAsset._id);
    }

    async getUserWalletConvertAsset(){
        let data = {
            id: this.convertAsset.walletID._id,
            with_assets: true
        };
        let response = await this.walletService.getUserWallet(data);
        if(!response.success){
            return;
        }
        let data_emit = {
            array: this.myWallets, 
            id: this.convertAsset.walletID._id, 
            newValue: response.result
        }
        this.on_replace_item_convert.emit(data_emit);
    }

    async getUserWalletConvertWallet(){
        let data = {
            id: this.convertWallet._id,
            with_assets: true
        };
        let response = await this.walletService.getUserWallet(data);
        if(!response.success){
            return;
        }
        let data_emit = {
            array: this.myWallets, 
            id: this.convertWallet._id, 
            newValue: response.result
        }
        this.on_replace_item_convert.emit(data_emit);
    }

    async getAsset(){
        let data = {
            id: this.convertAsset._id, 
            rawData: true
        };
        let response = await this.assetService.getAsset(data);
        if(!response.success){
            return;
        }
        let data_emit = {
            array: this.myAssets, 
            id: this.convertAsset._id, 
            newValue: response.result
        }
        this.on_replace_item_convert.emit(data_emit);
    }

    currencyDigitsInfo(decimalPlace){
    	return `1.${decimalPlace}`;
    }

}

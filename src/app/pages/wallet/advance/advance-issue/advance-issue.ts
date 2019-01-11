import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssuerService } from './../../../../@core/services/issuer.service';
import { MSAssetService } from './../../../../@core/services/ms-asset.service';
import { AssetService } from './../../../../@core/services/asset.service';
import { WalletService } from './../../../../@core/services/wallet.service';
import { Helper } from './../../../../@core/common/helper';

declare var $: any;

@Component({
    templateUrl: './advance-issue.html',
    styleUrls: ['./advance-issue.scss']
})

export class AdvanceIssueComponent implements OnInit {

	issuer: any = null;
	myAssets: Array<any> = [];
	myWallets: Array<any> = [];
	loadFinished: boolean = false;

	active_tab: string = 'new-asset';

    constructor(
    	private helper: Helper,
    	private issuerService: IssuerService,
    	private assetService: AssetService,
    	private walletService: WalletService,
        private mSAssetService: MSAssetService,
    ) {}

    ngOnInit() {
    	let get_tab = sessionStorage.getItem('AdvanceIssueTab');
    	if(get_tab === 'converter'){
    		this.active_tab = 'converter';
    	}else if(get_tab === 'issuing'){
    		this.active_tab = 'issuing';
    	}else{
    		this.active_tab = 'new-asset';
    	}
  		
  		this.loadAllData();
    }

    loadAllData(){
    	this.getIssuerInfo();
  		this.getUserMultisignAsset();
  		this.getAllUserWallets();
    }

    async getIssuerInfo(){
    	let response = await this.issuerService.getIssuerInfo({});
    	this.loadFinished = true;
    	if(!response.success){
    		return;
    	}
    	this.issuer = response.result;
    }

    async getUserMultisignAsset(){
    	let data = {};
    	let response = await this.mSAssetService.getUserMultisignAsset(data);
    	if(!response.success){
    		return;
    	}
    	this.myAssets = response.result.map(asset => {
            if (asset.receiveFeeWalletID) {
                asset.receiveFeeWalletURL = this.getWalletLink(asset.receiveFeeWalletID);
            }
            asset.availableSigner = asset.walletID.signers.find(signer => signer && signer.isOwned && signer.weight > 0);
            return asset;
        });

        this.myAssets.forEach((asset) => {
            asset.isLogoBeingChanged = true;
            asset.changingWallet = false;
        });
    }

    async getAllUserWallets(){
    	let data = {
    		with_assets: true, 
            with_advance: true
    	}
    	let response = await this.walletService.getAllUserWallets(data);
    	if(!response.success){
    		return;
    	}
    	this.myWallets = response.result;
    }

    getWalletLink(wallet) {
        if (!wallet) return '';
        if (!wallet.type) {
            return 'my-wallets;walletId=' + wallet._id;
        } else if (wallet.multisignType === 0) {
            return 'advance-wallet;walletId=' + wallet._id;
        } else {
            return 'multisign-wallet;walletId=' + wallet._id;
        }
    };

    onNewAssetIssue(){
    	this.loadAllData();
    }

    setStorageSessionIssue(tab){
    	sessionStorage.setItem('AdvanceIssueTab', tab);
    	this.active_tab = tab;
    }

    onReplaceItemNewIssuing(event){
    	this.replaceItem(event.array, event.id, event.newValue);
    }

    onReplaceItemConvert(event){
    	
    }

    replaceItem(array, id, newValue) {
        array.some((item, index) => {
            if (String(item._id) === String(id)) {
                array[index] = newValue;
                return true;
            }
        });
    };

}

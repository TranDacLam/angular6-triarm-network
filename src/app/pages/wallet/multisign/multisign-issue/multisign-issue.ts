import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssuerService } from './../../../../@core/services/issuer.service';
import { AssetService } from './../../../../@core/services/asset.service';
import { WalletService } from './../../../../@core/services/wallet.service';
import { Helper } from './../../../../@core/common/helper';

declare var $: any;

@Component({
    templateUrl: './multisign-issue.html',
    styleUrls: ['./multisign-issue.scss']
})

export class MultisignUserIssueWalletComponent implements OnInit {

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
    ) {}

    ngOnInit() {
    	let get_tab = sessionStorage.getItem('MultisignIssueTab');
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
  		this.getAllUserAssets();
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

    async getAllUserAssets(){
    	let data = {
    		withoutAdvance: false
    	}
    	let response = await this.assetService.getAllUserAssets(data);
    	if(!response.success){
    		return;
    	}
    	this.myAssets = response.result;
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

    onNewAssetIssue(){
    	this.loadAllData();
    }

    setStorageSessionIssue(tab){
    	sessionStorage.setItem('MultisignIssueTab', tab);
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

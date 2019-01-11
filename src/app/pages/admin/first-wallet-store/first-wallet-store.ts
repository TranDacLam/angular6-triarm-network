import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from './../../../@core/services/wallet.service';
import { UserService } from './../../../@core/services/user.service';

declare var $: any;

@Component({
    templateUrl: './first-wallet-store.html',
    styleUrls: ['./first-wallet-store.scss']
})

export class FirstWalletStoreComponent implements OnInit {

	limit: number = 50;
	currentPage: number = 1;
	waitTableData: boolean = false;
	deleting: any = {};
	isCreatingWallet: boolean = false;
	allFirstWallet: Array<any> = [];
	currentItems: Array<any> = [];
	NUMBER_OF_WALLET_DEFAULT: number = 50;
	option_extra: any;

    constructor(
    	private walletService: WalletService,
    	private userService: UserService,
        private router: Router
    ) {}

    ngOnInit() {
    	this.getAllFirstWalletNonUser();
    }

    async getAllFirstWalletNonUser(){
    	this.waitTableData = true;
    	let response = await this.walletService.getAllFirstWalletNonUser();
    	this.waitTableData = false;
    	if(!response.success){
            console.log(response.error.errorMessage);
    		return;
    	}
    	this.allFirstWallet = response.result;
    	this.currentItems = this.allFirstWallet.slice(0, this.limit);
    }

    createMultiFirstWallet(){
    	this.option_extra = {
    		email: this.userService.current_user.email
    	}
    	$('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
    	let data = {
    		numberOfWallet: this.NUMBER_OF_WALLET_DEFAULT,
    		code: event
    	};
    	this.isCreatingWallet = true;
    	let response = await this.walletService.createFirstWalletNonUser(data);
    	this.isCreatingWallet = false;
    	if(!response.success){
            console.log(response.error.errorMessage);
    		return;
    	}
    	this.allFirstWallet = this.allFirstWallet.concat(response.result);
    	this.currentItems = this.allFirstWallet.slice(0, this.limit);
    }

    pageChanged(event){
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.currentPage = event.page;
        this.currentItems = this.allFirstWallet.slice(startItem, endItem);
    }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
	selector: 'app-history-tab',
    templateUrl: './history-tab.html',
    styleUrls: ['./history-tab.scss']
})

export class HistoryTabComponent implements OnInit, OnChanges {

	@Output() on_wallet_option_change = new EventEmitter();
	@Output() on_change_to_page = new EventEmitter();
	@Output() on_next_to_page = new EventEmitter();

	@Input() wallets: Array<any>;
	@Input() allTransactions: Array<any>;
	@Input() currentTransactions: Array<any>;
	@Input() selectedWallet: any;
	@Input() contacts: Array<any>;
	@Input() sourceWalletLabel: Array<any>;
	@Input() operationType: Array<any>;
	@Input() receiveWalletLabel: Array<any>;
	@Input() currentPage: number;
	@Input() totalPages: number;
	@Input() limit: number;
	@Input() waitTableData: boolean;
	@Input() canGetMoreTransaction: boolean;
	@Input() hasWallet: boolean;

	isShowAll: boolean = false;

    constructor() {}

    ngOnInit() {}

    ngOnChanges(){
    }

    walletOptionChange(){
    	this.on_wallet_option_change.emit(this.selectedWallet);
    }

    getWalletNameFromAddress(walletAddress) {
	    let walletName = '';
	    this.wallets.forEach((wallet) => {
	      	if (wallet.address === walletAddress) walletName = wallet.name;
	    });
	    this.contacts.some((contact) => {
	      	if (contact.address === walletAddress) {
	        	walletName = contact.name;
	        	return true;
	      	}
	    });
	    return walletName;
  	};

  	changeToPage(page){
  		this.on_change_to_page.emit(page);
  	}

  	pageChanged(event) {
    	if(this.currentPage != event.page){
        	this.currentPage = event.page;
        	this.changeToPage(this.currentPage);
	    }
  	}

  	next(){
  		this.on_next_to_page.emit(true);
  	}
}

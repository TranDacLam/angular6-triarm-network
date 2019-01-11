import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MSWalletService } from './../../../../@core/services/ms-wallet.service';
import { MSTransactionService } from './../../../../@core/services/ms-transaction.service';
import { Helper } from './../../../../@core/common/helper';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import { PendingTransactionService } from './../../../../@core/services/pending-transaction.service';

declare var $: any;

@Component({
    templateUrl: './advance-transaction-status.html',
    styleUrls: ['./advance-transaction-status.scss']
})

export class AdvanceTransactionStatusComponent implements OnInit {

    wallets: Array<any> = [];
    items: Array<any> = [];
    currentTransactions: Array<any> = [];
    allTransaction: Array<any> = []; // backup all transaction
    limit: number = 5;
    currentPage: number = 1;
    totalPage: number = 0;
    totalRecord: number = 0;
    waitResponse: boolean = false;
    getTypeTransaction = null;
    selectedWallet: string = '';
    status: Array<number> = [0];
	
    constructor(
        private router: Router,
    	private mSWalletService: MSWalletService,
        private mSTransactionService: MSTransactionService,
        private pendingTransactionService: PendingTransactionService,
    	private helper: Helper,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
    	this.getAllMultisignWallet();
        this.getAllPendingTransaction();
        this.getTypeTransaction = this.pendingTransactionService.getTypeTransaction;
        this.items = [
            {val: 0, txt: this.t.transform('pending')}, 
            {val: 1, txt: this.t.transform('success')}, 
            {val: 2, txt: this.t.transform('failure')}
        ];
    }

    async getAllMultisignWallet(){
        let response = await this.mSWalletService.getAllMultisignWallet({});
        if(!response.success){
            return;
        }
        this.wallets = response.result;
    }

    async getAllPendingTransaction(){
        this.waitResponse = true;
        let data = {
            page: this.currentPage,
            limit: this.limit,
            query: this.selectedWallet,
            status: this.status
        }
        let response = await this.mSTransactionService.getAllPendingTransaction(data);
        this.waitResponse = false;
        if(!response.success){
            return;
        }
        this.currentTransactions = this.formatData(response.result.allPendingTXs, response.result.totalRecord);
    }

    formatData(data, total) {
        this.totalRecord = total;
        this.totalPage = Math.ceil(this.totalRecord / this.limit);
        return data.map((tran) => ({
            _id: tran._id,
            status: tran.status,
            walletID: tran.walletID._id,
            name: tran.walletID.name,
            address: tran.walletID.address,
            createdOn: tran.createdAt,
            user: {
                name: tran.signedBy.length > 0 ? tran.signedBy[0].signer.name : "",
                address: tran.signedBy.length > 0 ? tran.signedBy[0].signer.address : "",
            },
            signedAmount: tran.signedBy.length,
            totalSigners: tran.walletID.signers.length,
            weightRequire: tran.weightRequire,
            type: tran.type,
            weightSigned: this.sumBy(tran.signedBy),
        }));
    }

    sumBy(arr){
        let total = 0;
        arr.forEach(item => {
            total += item.weight;
        });
        return total;
    }

    exists(item) {
        return this.status.indexOf(item) > -1;
    }

    toggle(item) {
        let idx = this.status.indexOf(item);
        if (idx > -1) {
          this.status.splice(idx, 1);
        }
        else {
          this.status.push(item);
        }
        if (this.status.length == 0)
          this.status = [0];
        this.getAllPendingTransaction();
    }

    pageChanged(event){
        if(this.currentPage != event){
            this.currentPage = event;
            this.getAllPendingTransaction();
        }
    }

    walletOptionChange(){
        this.currentPage = 1;
        this.getAllPendingTransaction();
    }
}

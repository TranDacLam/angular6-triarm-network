import { Component, OnInit } from '@angular/core';
import { WalletService } from './../../../@core/services/wallet.service';
import { UserService } from './../../../@core/services/user.service';
import { MSWalletService } from './../../../@core/services/ms-wallet.service';
import { TransactionService } from './../../../@core/services/transaction.service';
import { SocketService } from './../../../@core/services/socket.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import * as moment from 'moment';

@Component({
    templateUrl: './history.html',
    styleUrls: ['./history.scss']
})

export class HistoryComponent implements OnInit {

	wallets: Array<any> = [];
  	contacts: Array<any> = [];
  	originalWallets: Array<any> = [];
  	selectedWallet: any = null;
  	waitTableData: boolean = false;
  	hasWallet: boolean = true;
  	currentTransactions: Array<any> = [];

  	//Init
  	currentPage: number = 1;
  	limit: number = 10;
  	allTransactions: Array<any> = [];
  	totalPages: number = 1;
  	cursor: string = '';
  	canGetMoreTransaction: boolean = true;
  	isShowAll: boolean = false;

  	// socket = null;
  	operationType: Array<string> = [];
  	sourceWalletLabel: Array<string> = [];
  	receiveWalletLabel: Array<string> = [];

  	tabId: string = 'normalTab';

    constructor(
    	private userService: UserService,
    	private walletService: WalletService,
    	private mSWalletService: MSWalletService,
    	private transactionService: TransactionService,
      private socketService: SocketService,
    	private t: TranslatePipe
    ) {}

    ngOnInit() {
    	this.sourceWalletLabel = [
    		this.t.transform('funder_wallet'),
    		this.t.transform('sender_wallet'),
    		this.t.transform('sender_wallet'),
    		this.t.transform('selling'),
    		this.t.transform('selling'),
    		this.t.transform('source_wallet'),
    		this.t.transform('trust_asset'),
    		this.t.transform('asset'),
    		this.t.transform('source_wallet'),
    	];
    	this.operationType = [
    		this.t.transform('create_wallet'),
    		this.t.transform('payment'),
    		this.t.transform('path_payment'),
    		this.t.transform('place_offer'),
    		this.t.transform('place_offer'),
    		this.t.transform('set_options'),
    		this.t.transform('change_trust'),
    		this.t.transform('allow_trust'),
    		this.t.transform('merge_wallet'),
    	];

    	this.receiveWalletLabel = [
    		this.t.transform('new_wallet'),
    		this.t.transform('receiver_wallet'),
    		this.t.transform('receiver_wallet'),
    		this.t.transform('buying'),
    		this.t.transform('buying'),
    		this.t.transform('signer'),
    		this.t.transform('issue_wallet'),
    		this.t.transform('request_wallet'),
    		this.t.transform('destination_wallet'),
    	];
    	this.getAllUserWallets();
    	this.getAllUserContacts();
      this.historySocket();
    }

    historySocket(){
      this.socketService.onSocketNotification().subscribe(
        (message: any) => {
          let walletAddressInNewTransaction = [];
          setTimeout(() => {
            message.created_at = moment(message.created_at).format('YYYY/MM/DD HH:mm:ss Z');
            for (let i = 0, length = message.operations.length; i < length; i++) {
              message.operations[i] = this.formatTransaction(message.operations[i], this.selectedWallet.address);
              walletAddressInNewTransaction.push(message.operations[i].sourceWallet);
              walletAddressInNewTransaction.push(message.operations[i].receiveWallet);
            }
            if (walletAddressInNewTransaction.indexOf(this.selectedWallet.address) > -1) {
              if (this.canGetMoreTransaction) this.allTransactions.pop();
              this.allTransactions.unshift(message);
              this.totalPages = Math.ceil(this.allTransactions.length / this.limit);
              // re render current page
              this.getTransactionsByPage();
              // set new cursor
              this.cursor = this.currentTransactions[this.currentTransactions.length - 1].cursor;
            }
          });
        }
      );
    }

    async getAllUserWallets(){
    	let data = {
    		with_active: true, 
    		with_advance: true
    	}
    	let response = await this.walletService.getAllUserWallets(data);
    	if(!response.success){
    		return;
    	}
    	if (response.result.length > 0) {
            this.waitTableData = true;
            this.hasWallet = false;
        }
        this.originalWallets = response.result;
        //Set Default wallet tab
        this.wallets = this.originalWallets.filter(w => w.type !== 1);
        //Set Default wallet
        this.selectedWallet = (this.wallets[0]) ? this.wallets[0] : null;
        this.getTransactionsOfWallet('', (transactions) => {
          if(transactions.length > 0){
          	transactions.forEach((transaction, index) => {
                	if (transaction.created_at)
                  	transactions[index].created_at = moment(transaction.created_at).format('YYYY/MM/DD HH:mm:ss Z');
                	else
                  	transactions[index].createdOn = moment(transaction.createdOn).format('YYYY/MM/DD HH:mm:ss Z');
                	if (transaction.id && transaction.operations) {
                  	transaction.operations.forEach((operation, indexOp) => {
                    		transactions[index].operations[indexOp] = this.formatTransaction(transactions[index].operations[indexOp], this.selectedWallet.address);
                  	});
                	}
              });
          }
            this.currentTransactions = (transactions || transactions.length !== 0) ? transactions : [];
            this.allTransactions = transactions;
            for (var i = transactions.length - 1; i >= 0; i--) {
              if (transactions[i] && transactions[i].paging_token) {
                this.cursor = transactions[i].paging_token;
                break;
              }
            }
            if (transactions.length < this.limit) {
              this.canGetMoreTransaction = false;
            }
            this.waitTableData = false;
            // console.log($scope.allTransactions);
        });
    }

    async getAllUserContacts(){
    	let response = await this.userService.getAllUserContacts();
    	if(!response.success){
    		return;
    	}
    	this.contacts = response.result;
    }

    async getTransactionsOfWallet(cursor, callback){
    	if(!this.selectedWallet){
    		return callback([]);
    	}

		let walletID = this.selectedWallet._id;
		let walletAddress = this.selectedWallet.address;
		let data = {
			cursor: cursor
		}
		if (this.selectedWallet.multisignType === 0) data['address'] = walletAddress;
  		else data['walletID'] = walletID;
  		let response = await this.walletService.getPaymentsOfWallet(data);
  		if(!response.success){
  			return callback([]);
  		}
  		if(response.result.length > 0){
  			let timeStart;
  			if(this.allTransactions.length > 0){
  				timeStart = this.allTransactions[this.allTransactions.length - 1].createdOn ? this.allTransactions[this.allTransactions.length - 1].createdOn : this.allTransactions[this.allTransactions.length - 1].created_at;
  			}else{
  				if (cursor)
	              	timeStart = response.result[0].created_at;
	            else
	              	timeStart = null;
  			}
  			let dataHistoryFail = {
  				walletID: walletID,
              	walletAddress: walletAddress,
              	timeStart: timeStart,
              	timeEnd: response.result[response.result.length - 1].created_at,
  			}
  			let response_history = await this.transactionService.getTransactionsHistory(dataHistoryFail);
        if(!response_history.success){
  				return callback(response.result);;
  			}
  			if (this.allTransactions.length > 0 && response_history.result.length > 0) {
                let rangeCheck = {};
                if (this.allTransactions.length <= this.limit) {
                    rangeCheck['start'] = 0;
                    rangeCheck['end'] = this.allTransactions.length - 1;
                } else {
                    rangeCheck['end'] = this.allTransactions.length - 1;
                    rangeCheck['start'] = rangeCheck['end'] - this.limit + 1;
                }
                for (let i = rangeCheck['start']; i <= rangeCheck['end']; i++) {
                    response_history.result.forEach((transaction, index) => {
                      	if (String(transaction._id) === String(this.allTransactions[i]._id)) {
                        	response_history.result.splice(index, 1);
                      	}
                    });
                }
            }
            if (response.result.length < 1){
                if (response_history.result.length < 1)
                    callback([]);
                else
                    callback(response_history.result.reverse())
            }else if (response_history.result.length < 1)
              	callback(response.result);
            else {
              	let dbTransaction = response_history.result;
              	let horizonTransaction = response.result;
              	let resultTransaction = dbTransaction.reverse().concat(horizonTransaction);
              	// if(new Date(dbTransaction[0].createdOn).getTime() < new Date(horizonTransaction[0].created_at).getTime()) {
              	resultTransaction.sort((transaction1, transaction2) => {
                    let date1 = transaction1.createdOn ? new Date(transaction1.createdOn) : new Date(transaction1.created_at);
                    let date2 = transaction2.createdOn ? new Date(transaction2.createdOn) : new Date(transaction2.created_at);
                    if (date2.getTime() > date1.getTime()) {
                      return 1;
                    } else {
                      return -1;
                    }
              	});
              	// }
              	if (resultTransaction.length <= this.limit)
                	callback(resultTransaction);
              	else {
                	callback(resultTransaction.slice(0, this.limit));
              	}
        	}
  		}else{
  			callback(response.result);
  		}
    }

    formatTransaction(transaction, walletAddress) {
	  /**
	   * status1: 'minus or plus',
	   * status2: 'from or to',
	   * asset: 'asset code, type',
	   * amount: '',
	   * partner: ''
	   * cursor: transaction cursor & transaction cursor
	   * created_at
	   */
	  let sourceWallet, receiveWallet, asset, sourceAsset, amount, partner, id, created_at, type_i, type, authorize,
	    thresholds, signer_key, signer_weight;
	  let cursor = transaction.cursor;
	  created_at = moment(transaction.created_at).format('YYYY/MM/DD HH:mm:ss Z');
	  switch (transaction.type_i) {
	    case 0:
	      asset = {asset_type: 'native', asset_code: 'RIA'};
	      amount = transaction.starting_balance;
	      authorize = null;
	      sourceWallet = transaction.funder;
	      receiveWallet = transaction.account;
	      type_i = transaction.type_i;
	      type = 'create wallet';
	      break;
	    case 1:
	      asset = {asset_type: transaction.asset_type, asset_code: transaction.asset_code || 'RIA'};
	      amount = transaction.amount;
	      authorize = null;
	      sourceWallet = transaction.from;
	      receiveWallet = transaction.to;
	      type_i = transaction.type_i;
	      type = 'payment';
	      break;
	    case 2:
	      asset = {
	        receiveAsset: {
	          asset_type: transaction.asset_type,
	          asset_code: transaction.asset_code || 'RIA'
	        },
	        sourceAsset: {
	          asset_type: transaction.source_asset_type,
	          asset_code: transaction.source_asset_code || 'RIA'
	        }
	      };
	      amount = {
	        receiveAmount: transaction.amount,
	        sourceAmount: transaction.source_max
	      };
	      authorize = null;
	      sourceWallet = transaction.from;
	      receiveWallet = transaction.to;
	      type_i = transaction.type_i;
	      type = 'path payment';
	      break;
	    case 3:
	      asset = {
	        receiveAsset: {
	          asset_type: transaction.buying_asset_type,
	          asset_code: transaction.buying_asset_code || 'RIA'
	        },
	        sourceAsset: {
	          asset_type: transaction.selling_asset_type,
	          asset_code: transaction.selling_asset_code || 'RIA'
	        }
	      };
	      amount = {
	        amountSold: transaction.amount,
	        price: transaction.price
	      };
	      authorize = null;
	      sourceWallet = walletAddress;
	      receiveWallet = walletAddress;
	      type_i = transaction.type_i;
	      type = 'place offer';
	      break;
	    case 4:
	      asset = {
	        receiveAsset: {
	          asset_type: transaction.buying_asset_type,
	          asset_code: transaction.buying_asset_code || 'RIA'
	        },
	        sourceAsset: {
	          asset_type: transaction.selling_asset_type,
	          asset_code: transaction.selling_asset_code || 'RIA'
	        }
	      };
	      amount = {
	        amountSold: transaction.amount,
	        price: transaction.price
	      };
	      authorize = null;
	      sourceWallet = walletAddress;
	      receiveWallet = walletAddress;
	      type_i = transaction.type_i;
	      type = 'place offer';
	      break;
	    case 5:
	      authorize = null;
	      // master_key_weight = transaction.master_key_weight;
	      thresholds = {
	        high: transaction.high_threshold,
	        med: transaction.med_threshold,
	        low: transaction.low_threshold
	      }

	      signer_key = transaction.signer_key || transaction.source_account;
	      signer_weight = transaction.master_key_weight || transaction.signer_weight;
	      sourceWallet = walletAddress;
	      type_i = transaction.type_i;
	      type = 'set options';
	      break;
	    case 6:
	      asset = {asset_type: transaction.asset_type, asset_code: transaction.asset_code || 'RIA'};
	      amount = null;
	      authorize = null;
	      sourceWallet = transaction.trustor;
	      receiveWallet = transaction.trustee;
	      type_i = transaction.type_i;
	      type = 'trust asset';
	      break;
	    case 7:
	      asset = {asset_type: transaction.asset_type, asset_code: transaction.asset_code || 'RIA'};
	      amount = null;
	      authorize = transaction.authorize;
	      sourceWallet = transaction.trustor;
	      receiveWallet = transaction.trustee;
	      type_i = transaction.type_i;
	      type = 'allow trust';
	      break;
	    case 8:
	      asset = {asset_type: transaction.asset_type, asset_code: transaction.asset_code || 'RIA'};
	      amount = null;
	      authorize = null;
	      sourceWallet = transaction.account;
	      receiveWallet = transaction.into;
	      type_i = transaction.type_i;
	      type = 'merge wallet';
	      break;
	  }

	  return {
	    sourceWallet: sourceWallet,
	    receiveWallet: receiveWallet,
	    asset: asset,
	    amount: amount,
	    type: type,
	    type_i: type_i,
	    created_at: created_at,
	    authorize: authorize,
	    thresholds: thresholds,
	    signer_key: signer_key,
	    signer_weight: signer_weight
	  };
	};

	walletOptionChange(selected_wallet){
    	this.selectedWallet = selected_wallet;
    	this.currentPage = 1;
	    this.allTransactions = [];
	    this.totalPages = 1;
	    this.cursor = '';
	    this.canGetMoreTransaction = true;

	    this.waitTableData = true;

	    this.getTransactionsOfWallet('', (transactions) => {
	      transactions.forEach((transaction, index) => {
	        if (transaction.created_at)
	          transactions[index].created_at = moment(transaction.created_at).format('YYYY/MM/DD HH:mm:ss Z');
	        else
	          transactions[index].createdOn = moment(transaction.createdOn).format('YYYY/MM/DD HH:mm:ss Z');
	        if (transaction.id && transaction.operations) {
	          transaction.operations.forEach((operation, indexOp) => {
	            transactions[index].operations[indexOp] = this.formatTransaction(transactions[index].operations[indexOp], selected_wallet.address);
	          });
	        }
	      });
	      this.waitTableData = false;
	      this.currentTransactions = (transactions || transactions.length !== 0) ? transactions : [];
	      this.allTransactions = transactions;
	      for (var i = transactions.length - 1; i >= 0; i--) {
	        if (transactions[i] && transactions[i].paging_token) {
	          this.cursor = transactions[i].paging_token;
	          break;
	        }
	      }
	      if (transactions.length < this.limit) {
	        this.canGetMoreTransaction = false;
	      }
	      // console.log(this.allTransactions);
	    });
    }

    changeToPage(page) {
    	if (page > 0) {
      		this.currentPage = page;
      		this.getTransactionsByPage();

    	}
  	}

  	getTransactionsByPage() {
	    let start = (this.currentPage - 1) * this.limit;
	    let end = this.currentPage * this.limit;
	    this.currentTransactions = this.allTransactions.slice(start, end);
  	}

  	nextToPage(event) {
	    if (this.canGetMoreTransaction && this.currentPage === this.totalPages) {
	      this.waitTableData = true;
	      this.getTransactionsOfWallet(this.cursor, (transactions) => {
	        transactions.forEach((transaction, index) => {
	          if (transaction.created_at)
	            transactions[index].created_at = moment(transaction.created_at).format('YYYY/MM/DD HH:mm:ss Z');
	          else
	            transactions[index].createdOn = moment(transaction.createdOn).format('YYYY/MM/DD HH:mm:ss Z');
	          if (transaction.id) {
	            transaction.operations.forEach((operation, indexOp) => {
	              transactions[index].operations[indexOp] = this.formatTransaction(transactions[index].operations[indexOp], this.selectedWallet.address);
	            });
	          }
	        });
	        this.waitTableData = false;
	        if (!transactions || transactions.length === 0) {
	          this.canGetMoreTransaction = false;
	        } else {
	          if (transactions.length < this.limit) this.canGetMoreTransaction = false;
	          for (var i = transactions.length - 1; i >= 0; i--) {
	            if (transactions[i] && transactions[i].paging_token) {
	              this.cursor = transactions[i].paging_token;
	              break;
	            }
	          }
	          this.currentTransactions = transactions;
	          // console.log($scope.allTransactions);
	          this.allTransactions = this.allTransactions.concat(transactions);
	          this.totalPages = Math.ceil(this.allTransactions.length / this.limit);
	          this.currentPage += 1;
	        }
	        // console.log($scope.allTransactions);
	      });
	    } else {
	      this.currentPage += 1;
	      this.changeToPage(this.currentPage)
	    }
  	}

  	async changeTab(currentTab){
  		this.waitTableData = true;
  		this.hasWallet = true;
  		switch (currentTab) {
	      case 0:
	      	this.tabId = 'normalTab';
	        this.wallets = this.originalWallets.filter(w => w.type !== 1);
	        if (this.wallets.length > 0) {
	          this.hasWallet = false;
	        }
	        this.selectedWallet = (this.wallets[0]) ? this.wallets[0] : null;
	        this.walletOptionChange(this.selectedWallet);
	        break;
	      case 1:
	      this.tabId = 'multiTab';
	        this.wallets = this.originalWallets.filter(w => w.multisignType === 1 || w.multisignType === 2);
	        if (this.wallets.length > 0) {
	          this.hasWallet = false;
	        }
	        this.selectedWallet = (this.wallets[0]) ? this.wallets[0] : null;
	        this.walletOptionChange(this.selectedWallet);
	        break;
	      case 2: {
	      	this.tabId = 'sharedTab';
	        let data = {};
	        let response = await this.mSWalletService.getAllMultisignWallet(data);
	        this.waitTableData = false
	        if(!response.success){
	            console.log(response.error);
	            return;
	        }
	        if(response.result.length > 0){
	        	this.hasWallet = false;
	        }
	        this.wallets = response.result;
	        this.selectedWallet = (this.wallets[0]) ? this.wallets[0] : null;
	        this.walletOptionChange(this.selectedWallet);
	      } break;

	    }
  	}
}

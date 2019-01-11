import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from './../../../../@core/services/wallet.service';
import { MSWalletService } from './../../../../@core/services/ms-wallet.service';
import { Helper } from './../../../../@core/common/helper';

declare var $: any;

@Component({
    templateUrl: './advance-wallet.html',
    styleUrls: ['./advance-wallet.scss']
})

export class AdvanceWalletsComponent implements OnInit {

	wallets: Array<any> = [];
  	selectedWallet: any = null;
  	isSelectedWalletNotAvailable: boolean = false;
  	waitResponse: boolean = false;
  	loadNewWallet: boolean = true;
  	currentSelectAssetID: string= '';
    param_walletId: string = '';
  	assetStatus: any = {
	    STATUS_PENDING: 1,
	    STATUS_REJECTED: 2,
	    STATUS_ACCEPTED: 3
  	};
  	waitTableData: boolean = false;

  	options_wallet_dialog: any = null;

    constructor(
    	private router: Router,
      private route: ActivatedRoute,
    	private walletService: WalletService,
    	private mSWalletService: MSWalletService,
    	public helper: Helper
    ) {}

    ngOnInit() {
      this.route.params.subscribe(params => {
            this.param_walletId = params.walletId ? params.walletId : '';
        });
    	this.getAllMultisignWallet();
    }

    async getAllMultisignWallet(){
    	this.waitTableData = true;
    	let data = {
    		with_assets: true,
    		with_qrcode: true
    	}
    	let response = await this.mSWalletService.getAllMultisignWallet(data);
    	this.waitTableData = false;
    	if(!response.success){
    		return;
    	}
    	this.wallets = response.result;
      if (this.wallets.length) {
        let wallet = null;
        if (this.param_walletId) {
          //-- search in wallets
          for (var i = 0; i < this.wallets.length; i++) {
            if (String(this.wallets[i]._id) === String(this.param_walletId)) {
              wallet = this.wallets[i];
              break;
            }
          }
        }
        this.selectedWallet = wallet || this.wallets[0];
        this.changeWallet();
      }
    }

    changeWallet() {
      console.log("selectedWallet", this.selectedWallet)
	    if (!this.selectedWallet) {
	      this.isSelectedWalletNotAvailable = true;
	      return;
	    }
	    if (this.selectedWallet.isOwned) {
	      let signer = this.selectedWallet.signers.filter((signer) => {
	        return signer.public_key === this.selectedWallet.address
	      });
	      this.isSelectedWalletNotAvailable = this.selectedWallet.block || !this.selectedWallet.active || signer.weight === 0 || !!this.helper.bitwiseAnd(this.selectedWallet.extraFlags, 0x01);
	      return;
	    }
	    this.isSelectedWalletNotAvailable = this.selectedWallet.block || !this.selectedWallet.active  || !!this.helper.bitwiseAnd(this.selectedWallet.extraFlags, 0x01);
  	}

  	openSelectWalletDialog(){
  		this.options_wallet_dialog = {
  			activeOnly: true, 
  			readyOnly: true, 
  			isMulti: false, 
  			paymentableOnly: true
  		}
  		$('#walletAdvanceDialog').modal('show');
  	}

  	onWalletAdvanceDialog(event){
  		this.router.navigate(['/wallet/advance-setting', {id: event._id}]);
  	}
}

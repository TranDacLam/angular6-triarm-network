import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from './../../../../@core/services/wallet.service';

declare var $: any;

@Component({
    templateUrl: './multisign-wallets.html',
    styleUrls: ['./multisign-wallets.scss']
})

export class MultisignUserWalletsComponent implements OnInit {

	wallets: Array<any> = [];
	allWallets: Array<any> = [];
	unMutisignWallets: Array<any> = [];
	selectedWallet: any = null;
	waitResponse: boolean = false;
    is_reset_option_wallet: boolean = false;
    param_walletId: string = '';

    waitTableData: boolean = false;

    constructor(
    	private router: Router,
        private route: ActivatedRoute,
    	private walletService: WalletService
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.param_walletId = params.walletId ? params.walletId : '';
        });
    	this.getAllUserWallets();
    }

    async getAllUserWallets(){
    	this.waitTableData = true;
    	let data = {
    		with_assets: true,
    		with_qrcode: true,
            with_advance: true
    	}
    	let response = await this.walletService.getAllUserWallets(data);
    	this.waitTableData = false;
    	if(!response.success){
    		return;
    	}
    	this.allWallets = response.result;
    	this.wallets = response.result.filter((wallet, index) => {
    		return wallet.type == 1 && wallet.multisignType != 0;
    	});
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
        }
    }

    changeSelectedWallet(event){
    	let index = this.wallets.findIndex( (item) => {
    		return item._id == event.target.value;
    	})
    	if(index >= 0){
    		this.selectedWallet = this.wallets[index];
    	}
    }
    

	openSetOptionWalletDialog(){
		// this.unMutisignWallets = this.allWallets.filter((wallet) => {
		// 	return wallet.active && !wallet.block && (wallet.signers.length == 1 && wallet.signers[0].weight == 1 && wallet.thresholds.high_threshold == 0 && wallet.thresholds.med_threshold == 0 && wallet.thresholds.low_threshold == 0);
		// });
		$('#setOptionWallet').modal('show');
	}

	onResetOptionWallet(event){
		this.is_reset_option_wallet = true;
		setTimeout(()=> {
			this.is_reset_option_wallet = false;
		}, 500)
	}
}

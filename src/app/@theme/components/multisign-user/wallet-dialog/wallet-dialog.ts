import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { WalletService } from '../../../../@core/services/wallet.service';
import { Helper } from '../../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-wallet-dialog-multi-sign-user',
    templateUrl: './wallet-dialog.html',
    styleUrls: ['./wallet-dialog.scss']
})

export class WalletDialogMultiSignUser implements OnInit, OnChanges {

    @Output() on_wallet_dialog = new EventEmitter();
    @Input() options: any;
    wallets: Array<any> = [];
    waitResponse: boolean = false;
    selectedWallet: any = null;

    constructor(
    	private walletService: WalletService,
        private helper: Helper
    ) {
    }

    ngOnInit() {
       
    }

    ngOnChanges(){
        if(this.options){
            this.getAllUserWallets();
        }
        this.selectedWallet = null;
    }

    async getAllUserWallets(){
        this.wallets = [];
        this.waitResponse = true;
        let data = {
            with_active: this.options.activeOnly || this.options.readyOnly,
            with_nonblock: this.options.readyOnly,
            with_assets: true,
            with_advance: true,
        }
        let response = await this.walletService.getAllUserWallets(data);
        this.waitResponse = false;
        if(!response.success){
            return;
        }
      if(this.options.issue) {
        this.wallets = response.result.filter( (wallet) => {
          return (wallet.type === 1 && wallet.multisignType !== 0) || wallet.type===0 ;
        });
      }
      else {
        this.wallets = response.result.filter( (wallet) => {
          return wallet.type === 1 && wallet.multisignType !== 0;
        });
      }
    }

    OK() {
        this.on_wallet_dialog.emit(this.selectedWallet);
        $('#walletDialogMultiSignUser').modal('hide');
    }

    checkWallet(wallet){
        if(wallet.active && !wallet.block){
            return '';
        }else if(!wallet.active && wallet.block){
            return 'inactive_and_blocked';
        }else if(!wallet.active){
            return 'inactive_';
        }else{
            return 'blocked_';
        }
    }
}

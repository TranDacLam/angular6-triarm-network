import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { WalletService } from './../../../@core/services/wallet.service';
import { Helper } from './../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-wallet-dialog',
    templateUrl: './wallet-dialog.html',
    styleUrls: ['./wallet-dialog.scss']
})

export class WalletDialog implements OnInit, OnChanges {

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
            with_advance: this.options.with_advance
        }
        let response = await this.walletService.getAllUserWallets(data);
        this.waitResponse = false;
        if(!response.success){
            return;
        }
        let arr_wallets = response.result;
        for (let i = 0; i < arr_wallets.length; i++) {
            if (this.options) {
                if (this.options.activeOnly) {
                    if (arr_wallets[i].active){
                        this.wallets.push(arr_wallets[i]);
                    }
                }

                //  WHAT ????????????????????????? view app old
                // if (this.options.readyOnly) {
                //     if (arr_wallets[i].active && !arr_wallets[i].block){
                //         this.wallets.push(arr_wallets[i]);
                //     }
                // }
            }
            this.wallets.push(arr_wallets[i]);
        }
        if (!this.options.with_advance) {
            this.wallets = this.wallets.filter((wallet, index) => {
                return wallet.multisignType != 2; // MULTISIGN_WALLET_COLD
            });
        }
        if(this.options.paymentableOnly){
            this.wallets = this.wallets.filter((wallet) => {
                let limitIssuing = null;
                if(wallet.extraFlags) limitIssuing = this.helper.bitwiseAnd(wallet.extraFlags, 0x01);
                return wallet.active && !wallet.block && !limitIssuing;
            });
        }
    }

    OK() {
        this.on_wallet_dialog.emit(this.selectedWallet);
        $('#walletDialog').modal('hide');
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

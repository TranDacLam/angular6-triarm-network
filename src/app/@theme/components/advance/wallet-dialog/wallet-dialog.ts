import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { WalletService } from './../../../../@core/services/wallet.service';
import { MSWalletService } from './../../../../@core/services/ms-wallet.service';
import { Helper } from './../../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-wallet-advance-dialog',
    templateUrl: './wallet-dialog.html',
    styleUrls: ['./wallet-dialog.scss']
})

export class WalletAdvanceDialog implements OnInit, OnChanges {

    @Output() on_wallet_advance_dialog = new EventEmitter();
    @Input() options: any;
    wallets: Array<any> = [];
    waitResponse: boolean = false;
    selectedWallet: any = null;

    constructor(
    	private walletService: WalletService,
        private mSWalletService: MSWalletService,
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
            with_advance: true
        }
        let name_action = this.options.mode === 'multisign_wallet' ? 'get_all_multisign_wallet' : 'get_all_user_wallets';
        let response: any = null;
        if(name_action === 'get_all_multisign_wallet'){
            response = await this.mSWalletService.getAllMultisignWallet(data);
            this.waitResponse = false;
            if(!response.success){
                return;
            }
            this.wallets = response.result.filter((wallet) => {
                if (!wallet.isOwned) return true;
                let masterKey = wallet.signers.find((signer) => { 
                    return signer.public_key === wallet.address 
                });
                if (masterKey && masterKey.weight > 0) return true;
                return false;
            });

        }else{
            response = await this.walletService.getAllUserWallets(data);
            this.waitResponse = false;
            if(!response.success){
                return;
            }
            if(this.options.mode === 'all_wallet'){
                this.wallets = response.result;
            }else{
                this.wallets = response.result.filter((wallet) => {
                    return !wallet.type
                });
            }
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
        this.on_wallet_advance_dialog.emit(this.selectedWallet);
        $('#walletAdvanceDialog').modal('hide');
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

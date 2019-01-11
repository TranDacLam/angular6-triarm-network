import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { WalletService } from '../../../@core/services/wallet.service';
import { TransactionService } from '../../../@core/services/transaction.service';
import { TranslatePipe } from './../../pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-wallet-active-dialog',
    templateUrl: './wallet-active-dialog.html',
    styleUrls: ['./wallet-active-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class WalletActiveDialog implements OnInit, OnChanges {

    @Input() data: any;
    @Output() on_wallet_active_dialog = new EventEmitter();

    unactiveWallet: any = null;
    walletsToActive: Array<any> = [];
    idWalletActive = '';
    startingBalance: any = null;
    waitResponse: boolean = false;
    transactionFee: number = 0;
    verifyGaCode = null;


    constructor(
        private walletService: WalletService,
        private transactionService: TransactionService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
        this.getAllUserWallets();
        this.getTransactionFee();
      $('#ActiveWalletDialog').on('hidden.bs.modal', (e) => {
        setTimeout(() =>{
          this.idWalletActive = '';
          this.startingBalance = null;
          this.verifyGaCode = null;
        }, 500)
      })
    }

    ngOnChanges(){
        if(this.data){
            this.unactiveWallet = this.data.wallet;
        }
    }

    async getAllUserWallets(){
        this.waitResponse = true;
        let data = {
            with_assets: false
        };
        let response = await this.walletService.getAllUserWallets(data);
        this.waitResponse = false;
        if(!response.success){
            return;
        }
        this.walletsToActive = response.result;
    }

    async getTransactionFee(){
        let response = await this.transactionService.transactionFee();
        if(!response.success){
            return;
        }
        this.transactionFee = response.result;
    }

    async activeWallet(){
        this.waitResponse = true;
        let data = {
            publicKey: this.unactiveWallet.address,
            walletId: this.idWalletActive,
            startingBalance: this.startingBalance,
            code: this.verifyGaCode
        };
        let response = await this.walletService.activeWallet(data);
        this.waitResponse = false;
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.on_wallet_active_dialog.emit();
        $('#ActiveWalletDialog').modal('hide');
    }

}

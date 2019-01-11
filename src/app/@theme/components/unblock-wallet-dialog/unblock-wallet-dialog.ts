import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { WalletService } from '../../../@core/services/wallet.service';
import { TranslatePipe } from './../../pipes/translate.pipe';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-unblock-wallet-dialog',
    templateUrl: './unblock-wallet-dialog.html',
    styleUrls: ['./unblock-wallet-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class UnblockWalletDialog implements OnInit, OnChanges {

    @Input() data: any;
    @Output() on_unblock_wallet_dialog = new EventEmitter();

    privateKey: string ='';
    userPassword: string = '';

    constructor(
        private walletService: WalletService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
      $('#unblockWallet').on('hidden.bs.modal', (e) => {
        setTimeout(() =>{
          this.privateKey = '';
          this.userPassword = '';
        }, 500)
      })
    }

    ngOnChanges() {

    }

    async OK(){
        let data_form = {
            privateKey: this.privateKey,
            userPassword: this.userPassword,
            walletID: this.data._id
        }
        let response = await this.walletService.unblockWallet(data_form);
        if(!response.success){
            swal(
                response.error.errorMessage,
                '',
                'error'
            );
            return;
        }
        $('#unblockWallet').modal('hide');
        this.on_unblock_wallet_dialog.emit(response.result);
    }
}

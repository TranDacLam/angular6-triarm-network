import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from './../../../@core/services/wallet.service';
import { UserService } from './../../../@core/services/user.service';
import { TransactionService } from './../../../@core/services/transaction.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './new.html',
    styleUrls: ['./new.scss']
})

export class NewWalletComponent implements OnInit {

    publicKey: string = '';
    secretKey: string = '';
    waitResponse: boolean = false;
    disabledWalletOption: boolean = true;
    disabledWalletOptionCheckbox: boolean = false;
    transactionFee: number = 0;
    verifyGaCode: string = '';
    wallets: Array<any> = [];
    isFirstWallet: boolean = true;
    walletId: string = '';
    name: string = '';
    startingBalance: number = 20;
    copied: boolean = false;

    msg_alert: string = '';
    type_alert: string = "danger";

    constructor(
        private router: Router,
        private userService: UserService,
        private walletService: WalletService,
        private transactionService: TransactionService,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
    	this.getAllUserWallets();
        this.getAllUserWalletsOther();
        this.getKeypair();
        this.getTransactionFee();
    }

    async getAllUserWallets(){
        let data = {
            with_assets: false
        }
        let response = await this.walletService.getAllUserWallets(data);
        if(!response.success){
            return;
        }
        this.wallets = response.result;
    }

    async getKeypair(){
        let response = await this.walletService.getKeypair({});
        if(!response.success){
            this.type_alert = 'danger';
            return this.msg_alert = this.t.transform(errors[response.error.errorCode]);
        }
        this.publicKey = response.result.publicKey;
        this.secretKey = response.result.secretKey;
    }

    async getTransactionFee(){
        let response = await this.transactionService.transactionFee();
        if(!response.success){
            this.type_alert = 'danger';
            return this.msg_alert = this.t.transform(errors[response.error.errorCode]);
        }
        this.transactionFee = response.result;
    }

    async getAllUserWalletsOther(){
        let data = {
            with_active: true, 
            with_nonblock: true, 
            with_assets: false, 
            with_qrcode: false
        }
        let response = await this.walletService.getAllUserWallets(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.isFirstWallet = response.result.length === 0;
    }

    isGreater20(value) {
        return value >= 20;
    }

    async save() {
        if (this.name && this.name.length > 30) {
            this.type_alert = 'danger';
            return this.msg_alert = this.t.transform('wallet_name_must_less_than_30_characters');
        }
        let data = {
          secretKey: this.secretKey,
          name: this.name.trim()
        };
        if (!this.disabledWalletOption && this.walletId)
            data['walletId'] = this.walletId;

        this.waitResponse = true;
        let response = await this.walletService.saveWallet(data);
        this.waitResponse = false;
        if(!response.success){
            this.type_alert = 'danger';
            return this.msg_alert = this.t.transform(errors[response.error.errorCode]);
        }
        swal(
            this.t.transform('SUCCESS'),
            '',
            'success'
        );
        this.router.navigate(['/wallet/my-wallets']);
    }

    create() {
        if (this.name && this.name.length > 30) {
            this.type_alert = 'danger';
            return this.msg_alert = this.t.transform('wallet_name_must_less_than_30_characters');
        }
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        let data = {
            secretKey: this.secretKey,
            name: this.name.trim(),
            startingBalance: this.startingBalance,
            code: event
        };
        if (!this.disabledWalletOption && this.walletId)
            data['walletId'] = this.walletId;
        this.waitResponse = true;
        let response = await this.walletService.createWallet(data);
        this.waitResponse = false;
        if(!response.success){
            if(response.error.errorCode == 25){
                switch(response.extra){
                    case 'tx_insufficient_balance':
                        swal(
                            this.t.transform('FUNDING_WALLET_NOT_ENOUGH_ARM'),
                            '',
                            'error'
                        );
                        break;
                    case 'changeTrustLowReserve':
                        swal(
                            this.t.transform('NEED_MORE_MONEY_HOLDING_WALLET_TRUST_NEW_ASSET'),
                            '',
                            'error'
                        );
                        break;
                    default:
                        swal(
                            this.t.transform(errors[response.error.errorCode]),
                            '',
                            'error'
                        );
                        break;
                }
            }else{
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
            }
            return;
        }
        if(response.firstWallet){
            this.userService.current_user.firstWalletCreated = response.firstWallet; 
        }
        swal(
            this.t.transform('SUCCESS'),
            '',
            'success'
        );
        this.router.navigate(['/wallet/my-wallets', {walletId: response.result._id}]);
    }

    setCopied(val: string){
        this.copied = true;
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        setTimeout(() => {
            this.copied = false;
        }, 2000);
    }
}

import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from './../../../@core/services/wallet.service';
import { AssetService } from './../../../@core/services/asset.service';
import { TransactionService } from './../../../@core/services/transaction.service';
import { MSTransactionService } from './../../../@core/services/ms-transaction.service';
import { MultiSignService } from './../../../@core/services/multi-sign.service';
import { MSWalletService } from './../../../@core/services/ms-wallet.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './transaction.html',
    styleUrls: ['./transaction.scss']
})

export class TransactionWalletComponent implements OnInit {

    mode: string = '';
    isSuccess: boolean = false;

    wallets: Array<any> = [];
    walletId = '';
    asset = '';
    query_amout = null;

    selectedWallet = null;
    selectedAsset = null;
    receivingAddress = null;
    amount = null;
    memoText = null;
    message: string = '';
    memoTextInvalid: boolean = false;

    activeWallets: Array<any> = [];
    transactionFee: number = 0;
    waitResponse: boolean = false;
    timer: number = 5;
    amountRegex: any;

    options_asset: any = null;
    options_wallet: any =  null;

    signer: any = null;

    msg_alert: string = '';
    type_alert: string = 'danger';

    waitData: boolean = false;
    options_choose_signer: any = null;
    selectedSigner: any = null;
    data_summary_dialog: any = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private walletService: WalletService,
        private assetService: AssetService,
        private transactionService: TransactionService,
        private mSTransactionService: MSTransactionService,
        private mutiSignService: MultiSignService,
        private mSWalletService: MSWalletService,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.mode = params.mode ? params.mode : '';
            this.walletId = params.wallet ? params.wallet : '';
            this.asset = params.asset ? params.asset : '';
            this.query_amout = params.amount ? params.amount : null;
        });
        this.getAllUserWallet();
        this.getAsset();
        this.getTransactionFee();
    }

    async getAllUserWallet(){
        this.waitData = true;
        let data = {
            with_assets: true
        }
        let response = await  this.walletService.getAllUserWallets(data);
        this.waitData = false;
        if(!response.success){
            return;
        }
        this.wallets = response.result;

        if(this.walletId){
            for (let i = 0; i < this.wallets.length; i++) {
                let wallet = this.wallets[i];
                if (wallet._id === this.walletId) {
                    this.selectedWallet = wallet;
                    break;
                }
            }
        }

        if(this.wallets.length > 0){
            // Get Wallet can send money
            for (let i = 0; i < this.wallets.length; i++) {
                let wallet = this.wallets[i];
                if (wallet.active && !wallet.block) {
                    this.activeWallets.push(wallet)
                }
            }
        }
    }

    async getAsset(){
        let data: any;
        if(this.asset && this.asset !== 'native'){
            data = {
                asset_code: this.asset
            }
        }else{
            data = {
                id: 0
            }
        }
        let response = await this.assetService.getAsset(data);
        if(!response.success){
            return;
        }
        this.selectedAsset = { ...response.result, balance: this.query_amout };
        this.amountRegex = new RegExp('[0-9]*[.]?[0-9]{0,' + this.selectedAsset.decimalPlace + '}');
    }

    async getTransactionFee(){
        let response = await this.transactionService.transactionFee();
        if(!response.success){
            return;
        }
        this.transactionFee = response.result;
    }

    changeMode(mode){
        this.mode = mode;
    }

    selectAsset(){
        if(this.mode === 'send'){
            this.options_asset = {
                mode: 'sell'
            }
        }else{
            this.options_asset = {
                mode: "buy", 
                ownedAssets: true, 
                otherAssets: true
            }
        }
        $('#assetDialog').modal('show');
    }

    onAssetDialog(event){
        this.selectedAsset = event.selectedAsset;
        this.amountRegex = new RegExp('[0-9]*[.]?[0-9]{0,' + this.selectedAsset.decimalPlace + '}');
        if (this.mode === 'send') {
            this.selectedWallet = event.selectedWallet;
            this.walletId = event.selectedWallet._id;
        }
    }

    onContactSelectDialog(event){
        this.receivingAddress = event;
    }

    selectWallet(){
        if(this.mode === 'send'){
            this.options_wallet = {
                readyOnly: true
            }
        }else{
            this.options_wallet = {}
        }
        $('#walletDialog').modal('show');
    }

    onWalletDialog(event){
        this.selectedWallet = event;
    }

    checkAmount(value) {
        let result = this.amountRegex.exec(value);
        let get_val = result[0] == '' ? '' : result[0];
        $('.amount-mode').val(get_val);
        this.amount = get_val;
    }

    byteLength(str) {
        // returns the byte length of an utf8 string
        let s = str.length;
        for (let i = str.length - 1; i >= 0; i--) {
            let code = str.charCodeAt(i);
            if (code > 0x7f && code <= 0x7ff) s++;else if (code > 0x7ff && code <= 0xffff) s += 2;
            if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
        }
        return s;
    }

    checkMemo(value) {
        let get_val = (value[0] && value[0] === ' ') ? value.substr(1) : value;
        while (this.byteLength(get_val) > 28) {
            get_val = get_val.slice(0, get_val.length - 1);
        }
        $('#memo').val(get_val);
        this.memoText = get_val;
    }

    checkMessageLength(value) {
      let message = (value[0] && value[0] === ' ') ? value.substr(1) : value;
        while (this.byteLength(message) > 28) {
          message = message.slice(0, message.length - 1);
        }
        $('#message').val(message);
        this.message = message;
    }

    submitSend(){
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        this.waitResponse = true;
        let asset_code = this.selectedAsset.asset_code ? this.selectedAsset.asset_code : this.selectedAsset.name;
        asset_code = "RIA" === asset_code ? "RIA" : asset_code;
        let data = {
            walletId: this.walletId,
            asset: asset_code,
            amount: this.amount,
            destination: this.receivingAddress,
            code: event,
        };
        if (this.memoText && !this.memoTextInvalid) {
            data['memo'] = {
                type: 'MemoText',
                value: this.memoText.trim()
            }
        }
        let response = await this.transactionService.transferMoney(data);
        if(!response.success){
            this.waitResponse = false;
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        swal(
            this.t.transform('SUCCESS'),
            '',
            'success'
        );
        this.router.navigate(['/wallet/my-wallets']);
    }

    async generateQrCode() {
        let data = {
            address: this.selectedWallet.address,
            assetCode: this.selectedAsset.name || this.selectedAsset.asset_code || 'RIA',
            amount: this.amount,
            message: this.message.trim()
        };
        let response = await this.transactionService.generateRequestMoneyQrcode(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.data_summary_dialog = {
            address: this.selectedWallet.address,
            asset: this.selectedAsset,
            amount: this.amount,
            name: this.selectedAsset.name,
            qrData: response.qrData
        };
        $('#summaryDialog').modal('show');
    }

}

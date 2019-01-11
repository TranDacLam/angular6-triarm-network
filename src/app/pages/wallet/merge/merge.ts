import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from './../../../@core/services/wallet.service';
import { MSWalletService } from './../../../@core/services/ms-wallet.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './merge.html',
    styleUrls: ['./merge.scss']
})

export class MergeComponent implements OnInit {

    processing: boolean = false;
    sourceWallet = null;
    destinationWallet = null;

    options_wallet: any = null;
    selectTypeWallet: string = '';

    constructor(
    	private router: Router,
        private walletService: WalletService,
        private mSWalletService: MSWalletService,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
    }

    selectSourceWallet(){
        this.selectTypeWallet = 'source';
        this.options_wallet = {
            readyOnly: false
        };
        $('#walletDialog').modal('show');
    }

    onWalletDialog(event){
        if(this.selectTypeWallet === 'source'){
            this.sourceWallet = event;
        }else{
            this.destinationWallet = event;
        }
    }

    selectDestinationWallet(){
        this.selectTypeWallet = 'destination';
        this.options_wallet = {
            readyOnly: false
        };
        $('#walletDialog').modal('show');
    }

    async checkSigner() {
        let data = {
            walletID: this.sourceWallet._id
        }
        let response = await this.mSWalletService.checkSignerWallet(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        if(response.result){
            swal(
                this.t.transform('wallet_merge_a_signer'),
                '',
                'warning'
            );
        }else{
            this.getTFA();
        }
    }

    getTFA(){
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        let data = {
            sourceWalletID: this.sourceWallet._id,
            destinationWalletID: this.destinationWallet._id,
            code: event
        }
        let response = await this.walletService.mergeWallet(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        swal(
            this.t.transform('MERGE_WALLET_SUCCESS'),
            '',
            'success'
        );
        this.router.navigate(['/wallet/my-wallets', {walletId: this.destinationWallet._id}]);
    }
}

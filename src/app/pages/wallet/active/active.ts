import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from './../../../@core/services/wallet.service';
import { UserService } from './../../../@core/services/user.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './active.html',
    styleUrls: ['./active.scss']
})

// tslint:disable-next-line:component-class-suffix
export class ActiveWalletComponent implements OnInit {

    wallets: Array<any> = [];
    otherAddressWallet = null;
    myAddressWallet: string = '';
    walletId: string = '';
    startingBalance: number = null;
    waitResponse: boolean = false;
    fromMyWalletCheckbox: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private walletService: WalletService,
        private router: Router,
        private userService: UserService,
        private t: TranslatePipe
    ) { }

    ngOnInit() {
        this.getAllUserWallets();
    }

    async getAllUserWallets(){
        this.waitResponse = true;
        let data = {
            with_assets: false, 
            with_nonblock: true
        }
        let response = await this.walletService.getAllUserWallets(data);
        this.waitResponse = false;
        if(!response.success){
            return;
        }
        this.wallets = response.result;
    }

    activeWallet(){
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        this.waitResponse = true;
        let data = {
            publicKey: this.fromMyWalletCheckbox ? this.myAddressWallet : this.otherAddressWallet,
            walletId: this.walletId,
            startingBalance: this.startingBalance,
            code: event
        }
        let response = await this.walletService.activeWallet(data);
        this.waitResponse = false;
        if(!response.success){
            swal(
                response.error.errorMessage,
                '',
                'error'
            )
            return;
        }
        swal(
            this.t.transform('SUCCESS'),
            '',
            'success'
        )
        this.router.navigate(['/wallet/my-wallets']);
    }
}

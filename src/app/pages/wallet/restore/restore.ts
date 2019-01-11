import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from './../../../@core/services/wallet.service';
import { errors } from './../../../@core/common/error-code';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';

@Component({
    templateUrl: './restore.html',
    styleUrls: ['./restore.scss']
})

// tslint:disable-next-line:component-class-suffix
export class RestoreComponent implements OnInit {

    name: string = '';
    secretKey: string = '';
    waitResponse: boolean = false;
    mode: string = '';

    msg_error: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private walletService: WalletService,
        private t: TranslatePipe
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.mode = params.mode ? params.mode : '';
        });
    }

    async restore(){
        this.waitResponse = true;
        let data = {
            name: this.name,
            secretKey: this.secretKey
        }
        let response = await this.walletService.restoreWallet(data);
        this.waitResponse = false;
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        if(this.mode !== 'multisign'){
            return this.router.navigate(['/wallet/my-wallets']);
        }else{
            return this.router.navigate(['/wallet/multisign-wallet']);
        }
    }
}

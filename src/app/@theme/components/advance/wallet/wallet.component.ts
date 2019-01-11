import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from './../../../../@core/services/wallet.service';
import { MSAssetService } from './../../../../@core/services/ms-asset.service';
import { Helper } from './../../../../@core/common/helper';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
    selector: 'app-wallet-advance',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})

export class WalletAdvanceComponent implements OnInit, OnChanges {

    @Input() selectedWallet: any;
    @Input() wallets: any;
    @Input() isSelectedWalletNotAvailable: boolean;

    is_rename_wallet: boolean = false;
    waitResponse: boolean = false;

    constructor(
        private router: Router,
        private walletService: WalletService,
        private mSAssetService: MSAssetService,
        public helper: Helper,
        private t: TranslatePipe,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        
    }

    onFocusOutRenameWallet(){
        this.is_rename_wallet = false;
    }

    onFocusRenameWallet(){
        this.is_rename_wallet = true;
        setTimeout(() => {
            $('.rename-wallet').focus();
        }, 100)
    }

    async renameWallet(name) {
        this.waitResponse = true;
        if (!name) {
            return false;
        }
        var data = {
            newName: name,
            walletID: this.selectedWallet._id
        };
        let response = await this.walletService.renameWallet(data);
        this.waitResponse = false;
        this.is_rename_wallet = false;
        if(!response.success){
            swal(
                response.error.errorMessage,
                '',
                'error'
            );
            return;
        }
        this.selectedWallet.name = name;
    }

    openUnblockWalletDialog(){
        $('#unblockWallet').modal('show');
    }

    onUnblockWalletDialog(event){
        this.selectedWallet.block = false;
        swal(
            this.t.transform('WALLET_UNBLOCK'),
            '',
            'success'
        );
    }

    copyWalletAddress(val: string){
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
      this.toastr.success(this.t.transform('copy_success'));
    }

}

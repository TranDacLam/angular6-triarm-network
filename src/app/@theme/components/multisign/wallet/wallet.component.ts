import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from './../../../../@core/services/wallet.service';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-wallet-multisign',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})

export class WalletMultiSignComponent implements OnInit, OnChanges {

    @Input() selectedWallet: any;

    is_rename_wallet: boolean = false;
    waitResponse: boolean = false;
    currentSelectAssetID: string = '';
    data_wallet_active: any = null;

    constructor(
        private router: Router,
        private walletService: WalletService,
        private t: TranslatePipe
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
            return;
        }
        this.selectedWallet.name = name;
    }

    activeWallet(){
        this.data_wallet_active = {
            wallet: this.selectedWallet
        }
        $('#ActiveWalletDialog').modal('show');
    }

    onWalletActiveDialog(){
        swal(
            this.t.transform('ACTIVE_WALLET_SUCCESS'),
            '',
            'success'
        );
        this.router.navigate(['/admin/multisign/wallets']);
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
    }

}

import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../../@core/services/user.service';
import { WalletService } from './../../../@core/services/wallet.service';
import { SocketService } from './../../../@core/services/socket.service';
import { Helper } from './../../../@core/common/helper';
import { errors } from './../../../@core/common/error-code';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './my-wallets.html',
    styleUrls: ['./my-wallets.scss']
})

export class MyWalletsComponent implements OnInit {

	wallets: Array<any> = [];
	selectedWallet: any;
	is_rename_wallet: boolean = false;
    waitResponse: boolean = false;
    waitData: boolean = false;
    param_walletId: string = '';
    loadNewWallet: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    	public userService: UserService,
    	private walletService: WalletService,
        private socketService: SocketService,
    	private helper: Helper,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.param_walletId = params.walletId ? params.walletId : '';
        });
        this.walletSocket();
    	this.getAllUserWallets();
    }

    walletSocket(){
        this.socketService.onSocketNotification().subscribe(
            (message: any) => {
                switch (message.type_i) {
                    case 0:
                        this.wallets.forEach((wallet, index) => {
                            if (wallet.address === message.funder || wallet.address === message.account) {
                                if (wallet.address === message.account)
                                    this.loadNewWallet = false;
                                let data = {
                                    address: wallet.address,
                                    with_assets: true
                                };
                                this.getUserWallet(data, index);
                            }
                        });

                        if (this.loadNewWallet) {
                            let data = {
                                address: message.account,
                                with_assets: true
                            };
                            this.getUserWalletLoadNew(data);
                        }
                        break;

                    case 1:
                        this.wallets.forEach((wallet, index) => {
                            if (wallet.address === message.from || wallet.address === message.to) {
                                let data = {
                                    address: wallet.address,
                                    with_assets: true
                                };
                                this.getUserWallet(data, index);
                            }
                        });
                        break;

                    case 2:
                        this.wallets.forEach((wallet, index) => {
                            if (wallet.address === message.from || wallet.address === message.to) {
                                let data = {
                                    address: wallet.address,
                                    with_assets: true
                                };
                                this.getUserWallet(data, index);
                            }
                        });
                        break;

                    case 3:
                        this.wallets.forEach((wallet, index) => {
                            if (wallet._id === message.walletID) {
                                let data = {
                                    id: wallet._id,
                                    with_assets: true
                                };
                                this.getUserWallet(data, index);
                            }
                        });
                        break;

                    case 6:
                        this.wallets.forEach((wallet, index) => {
                            if (wallet.address === message.trustor) {
                                let data = {
                                    address: wallet.address,
                                    with_assets: true
                                };
                                this.getUserWallet(data, index);
                            }
                        });
                        break;

                    case 8:
                        this.wallets.forEach((wallet, index) => {
                            if (wallet.address === message.into) {
                                let data = {
                                    address: wallet.address,
                                    with_assets: true
                                };
                                this.getUserWallet(data, index);
                            }
                            if (wallet.address === message.account) {
                                this.selectedWallet = this.wallets[index - 1];
                                this.wallets.splice(index, 1);
                            }
                        });
                        break;
                }
            }
        );
    }

    async getUserWallet(data, index){
        let response = await this.walletService.getUserWallet(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        if (this.selectedWallet._id === response.result._id) {
            this.wallets[index] = response.result;
            this.selectedWallet = this.wallets[index];
        } else {
            this.wallets[index] = response.result;
        }
    }

    async getUserWalletLoadNew(data){
        let response = await this.walletService.getUserWallet(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.wallets.push(response.result);
    }

    async getAllUserWallets(){
        this.waitData = true;
    	let data = {
    		with_assets: true,
        	with_qrcode: true
    	}
    	let response = await this.walletService.getAllUserWallets(data);
    	this.waitData = false;
        if(!response.success){
    		return;
    	}
    	this.wallets = response.result;

    	// SOCKET

    	if (this.wallets.length) {
            let wallet = null;
            if (this.param_walletId) {
              //-- search in wallets
                for (var i = 0; i < this.wallets.length; i++) {
                    if (String(this.wallets[i]._id) === String(this.param_walletId)) {
                        wallet = this.wallets[i];
                        break;
                 }
                }
            }
            this.selectedWallet = wallet || this.wallets[0];
        }
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
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.selectedWallet.name = name;
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

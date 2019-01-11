import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../../../../@core/services/user.service';
import { WalletService } from './../../../../../@core/services/wallet.service';
import { IssuerService } from './../../../../../@core/services/issuer.service';
import { IcoService } from './../../../../../@core/services/ico.service';
import swal from 'sweetalert2';
import { TranslatePipe } from './../../../../../@theme/pipes/translate.pipe';
import { errors } from './../../../../../@core/common/error-code';

declare var $: any;

@Component({
    templateUrl: './user-info.html',
    styleUrls: ['./user-info.scss']
})

export class UserInfoComponent implements OnInit {

	SUPER_ADMIN: number = 999;
	SUB_SYSTEM_ADMIN: number = 9;

	user_detail: any = null;
	wallets: Array<any> = [];
	issuer: any = null;
	issuerLatestRequest: any = null;
	is_edit_email: boolean = false;
	msg_alert: string = '';
	type_alert: string = 'success';

	isPermission: boolean;
    waitingChange: boolean = false;

    constructor(
        private router: Router,
    	private route: ActivatedRoute,
    	public userService: UserService,
    	private walletService: WalletService,
    	private issuerService: IssuerService,
        private icoService: IcoService,
    	private t: TranslatePipe
    ) {}

    ngOnInit() {
  		if (this.route.snapshot.paramMap.get('armId')) {
            let arm_id = this.route.snapshot.paramMap.get('armId');
            this.getUserInfoByArmId(arm_id);
            this.getWalletsInfoByArmId(arm_id);
            this.getIssuerInfoByArmId(arm_id);
        }
    }

    async getUserInfoByArmId(arm_id){
    	let response = await this.userService.getUserInfoByArmId(arm_id);
    	if(!response.success){
    		return;
    	}
    	this.user_detail = response.result; 
    	this.isPermission = this.user_detail.userClass.indexOf(this.SUB_SYSTEM_ADMIN) >= 0 ? true : false;
    }

    async getWalletsInfoByArmId(arm_id){
    	let response = await this.walletService.getWalletsInfoByArmId(arm_id, false);
    	if(!response.success){
    		return;
    	}
    	this.wallets = response.result; 
    }

    async getIssuerInfoByArmId(arm_id){
    	let response = await this.issuerService.getIssuerInfoByArmId(arm_id);
    	if(!response.success){
    		return;
    	}
    	this.issuer = response.result; 
    	this.issuerLatestRequest = response.issuerLatestRequest;
    }

    editUserInfo(val){
    	if(val === 'info'){
    		this.is_edit_email = false;
    	}else{
    		this.is_edit_email = true;
    	}
    	$('#editUserInfo').modal('show');
    }

    async onSubmitEditUser(event){
    	if(this.is_edit_email === true){
    		let data  = {
    			id: this.user_detail._id,
    			email: event.email
    		}
    		let response = await this.userService.editUserEmail(data);
    		if(!response.success){
    			swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
    			return;
    		}
    		this.user_detail.email = event.email;
    		swal(
                this.t.transform('SUCCESS'),
                '',
                'success'
            );
    	}else{
    		let data  = {
    			id: this.user_detail._id,
    			firstname: event.firstname,
    			middlename: event.middlename,
    			lastname: event.lastname
    		}
    		let response = await this.userService.editUserInfo(data);
    		if(!response.success){
    			swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
                return;
    		}
    		this.user_detail.firstname = event.firstname;
    		this.user_detail.middlename = event.middlename;
    		this.user_detail.lastname = event.lastname;
    		swal(
                this.t.transform('SUCCESS'),
                '',
                'success'
            );
    	}
    }

    changeAccountStatusUser(action) {
    	swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('are_you_sure'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('ok_'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
            	let data = {
            		_id: this.user_detail._id,
            		action
            	}
            	this.userService.adminChangeStatusUser(data).then(
            		(response) => {
            			if(!response.success){
            				swal(
                                this.t.transform(errors[response.error.errorCode]),
                                '',
                                'error'
                            );
                            return;
            			}
            			this.user_detail.accountStatus = response.result.accountStatus;
            			let status = this.user_detail.accountStatus == 1 ? 'locked' : 'unlocked';
	            		swal(
                            `${this.t.transform('Update_user_info_success')} ${status}`,
                            '',
                            'success'
                        );
	            	}
	            )
            }
        });
	};

	resetTfa() {
		swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('are_you_sure'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('ok_'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
            	let data = {
            		armId: this.user_detail.armId
            	}
            	this.userService.adminRequestResetGa(data).then(
            		(response) => {
            			if(!response.success){
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
	            	}
	            )
            }
        });
	};

	async makePermissionToggle() {
		let data = {
			userId: this.user_detail._id,
			permissionType: this.SUB_SYSTEM_ADMIN,
			permission: !this.isPermission
		};
		let response = await this.userService.setPermissionUser(data);
		if(!response.success){
			swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
		}
		this.isPermission = !this.isPermission;
	}

	unblockOneWallet(wallet) {
		this.unblockWallet([wallet]);
	};

	unblockAllWallet() {
		this.unblockWallet(this.wallets);
	};

	unblockWallet(listWallet) {
		let listWalletAddress: Array<any> = [];
		listWallet.forEach(function (wallet) {
			if (wallet.block)
				listWalletAddress.push(wallet.address);
		});

		if (listWalletAddress.length > 0) {
			swal({
	            title: this.t.transform('confirm_'),
	            text: this.t.transform('are_you_sure'),
	            showCancelButton: true,
	            confirmButtonText: this.t.transform('ok_'),
	            cancelButtonText: this.t.transform('cancel_'),
	            confirmButtonColor: '#4018AC',
	            reverseButtons: true,
	        }).then((result) => {
	            if (result.value) {
	            	let data = {
	            		armId: this.user_detail.armId
	            	}
	            	this.walletService.adminUnblockWallet(listWalletAddress).then(
	            		(response) => {
	            			if(!response.success){
	            				swal(
                                    this.t.transform(errors[response.error.errorCode]),
                                    '',
                                    'error'
                                );
                                return;
	            			}
	    					listWallet.forEach(function (wallet) {
								if (wallet.block)
									wallet.block = false;
							});
                            swal(
                                this.t.transform('SUCCESS'),
                                '',
                                'success'
                            );
		            	}
		            )
	            }
	        });
		} else {
            swal(
                this.t.transform('NO_WALLET_UNBLOCK'),
                '',
                'error'
            );
		}
	}

    async togglePersonalInfo(event){
        let data = {
            issuerId: this.issuer._id,
            publicPersonalInfo: !this.issuer.publicPersonalInfo
        }
        let response = await this.issuerService.setStatusPersonalInfoIssuer(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.issuer.publicPersonalInfo = !this.issuer.publicPersonalInfo;
    }

    async toggleIcoMaker(event){
        let data = {
            issuerId: this.issuer._id,
            icoMaker: !this.issuer.isICOMaker
        }
        let response = await this.icoService.changeIcoMakerAuth(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.issuer.isICOMaker = !this.issuer.isICOMaker;
    }

}

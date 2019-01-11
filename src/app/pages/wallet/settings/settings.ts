import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssuerService } from './../../../@core/services/issuer.service';
import { MerchantService } from './../../../@core/services/merchant.service';
import { UserService } from './../../../@core/services/user.service';
import { Helper } from './../../../@core/common/helper';
import { errors } from './../../../@core/common/error-code';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';

@Component({
    templateUrl: './settings.html',
    styleUrls: ['./settings.scss']
})

export class SettingsComponent implements OnInit {

	active_tab: string = 'general';

	issuer: any = null;
	merchant: any = null;
	issuerLatestRequest: any = null;
	loginHistories: Array<any> = [];
    loginHistoriesArray: Array<any> = [];

    tfaMethod = null;
    resetGAProcess: boolean = false;
    loginTFARequire: boolean = false;

    msg_reset_tfa_dialog: string = '';

    date_now = Date.now();

    constructor(
    	private issuerService: IssuerService,
    	private merchantService: MerchantService,
    	public userService: UserService,
    	public helper: Helper,
        private router: Router,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
    	this.active_tab = sessionStorage.getItem('settingTab') == 'security' ? 'security' : 'general';
    	this.getIssuerInfo();
    	this.getMerchantInfo();
        this.getLoginHistory();
        this.loginTFARequire = this.userService.current_user.loginTFARequire;
        this.tfaMethod = this.userService.current_user.tfaMethod;
    }

    setStorageSessionSettings(tab){
    	sessionStorage.setItem('settingTab', tab);
    	this.active_tab = tab;
    }

    async getIssuerInfo(){
    	let response = await this.issuerService.getIssuerInfo({});
    	if(!response.success){
    		return;
    	}
    	this.issuer = response.result;
    	this.issuerLatestRequest = response.issuerLatestRequest || null;
    	if(this.issuerLatestRequest) {
        setTimeout(() => {
          this.issuerLatestRequest.issuerImage[0] += `?_=${Date.now()}`;
          this.issuerLatestRequest.issuerImage[1] += `?_=${Date.now()}`;
        }, 1000);
      }
    }

    async getMerchantInfo(){
    	let response = await this.merchantService.getMerchantInfo();
    	if(!response.success){
    		return;
    	}
    	this.merchant = response.result;
    }

    async getLoginHistory(){
    	let response = await this.userService.getLoginHistory();
    	if(!response.success){
    		return;
    	}
    	this.loginHistoriesArray = response.result;
        this.loginHistories = this.loginHistoriesArray.slice(0, 5);
    }

    async inputDialog(value){
        this.resetGAProcess = true;
        let data: any = {
            resetCode: value.codeValue,
            password: value.passwordValue
        }; 
        let response = await this.userService.requestResetGa(data);
        this.resetGAProcess = false;
        setTimeout(() => {
            this.msg_reset_tfa_dialog = '';
        }, 3000);
        if(!response.success){
            return this.msg_reset_tfa_dialog = this.t.transform(errors[response.error.errorCode]);
        }
        
    }

    changeTFAMethod(value){

    }

    async changeLoginTFARequire(event){
        let response = await this.userService.changeLoginTfaRequire(this.loginTFARequire);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.userService.current_user.loginTFARequire = this.loginTFARequire;
    }

    changeVerifyEmail(event){
        this.userService.current_user.verifyEmail = true;
    }

    onIssuerDialog(){
        this.getIssuerInfo();
        this.getMerchantInfo();
        this.getLoginHistory();
    }

    changeVerifyGa(event){
        this.userService.current_user.tfaEnabled = true;
        this.userService.current_user.verifyGA = event;
        this.tfaMethod = 1;
        this.userService.current_user.tfaMethod = 1;

    }

    pageChanged(event){
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.loginHistories = this.loginHistoriesArray.slice(startItem, endItem);
    }

    async toggleInfoIssuer(){
        let data = {
            issuerId: this.issuer._id,
            publicPersonalInfo: !this.issuer.publicPersonalInfo
        };
        let response = await this.issuerService.changeStatusPersonalInfoIssuer(data);
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
}

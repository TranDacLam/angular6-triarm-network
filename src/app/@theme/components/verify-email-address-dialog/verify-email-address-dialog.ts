import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssuerService } from './../../../@core/services/issuer.service';
import { UserService } from './../../../@core/services/user.service';
import { TranslatePipe } from './../../pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import { Helper } from './../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-verify-email-address-dialog',
    templateUrl: './verify-email-address-dialog.html',
    styleUrls: ['./verify-email-address-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class VerifyEmailAddressDialog implements OnInit {

    @Output() change_verify_email = new EventEmitter();

    processing: boolean = false;
    sendingCode: boolean = false;
    msg_alert: string = '';
    type_alert: string = 'danger';
    code: string = '';


    constructor(
    	private issuerService: IssuerService,
    	public helper: Helper,
        public userService: UserService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
      
    }


    async OK(){
        this.processing = true;
        let response = await this.userService.verifyEmail(this.code)
        this.processing = false;
        if(!response.success){
            this.code = '';
            this.type_alert = 'danger';
            return this.msg_alert = this.t.transform(errors[response.error.errorCode]);
        }
        this.msg_alert = '';
        $('#verifyEmailDialog').modal('hide');
        this.change_verify_email.emit('success');
    }

    async resendEmail(){
        this.sendingCode = true;
        let response = await this.userService.resendVerifyEmail();
        this.sendingCode = false;
        if(!response.success){
            this.type_alert = 'danger';
            return this.msg_alert = this.t.transform(errors[response.error.errorCode]);
        }
        this.type_alert = 'success';
        this.msg_alert = this.t.transform('email_sent')
        setTimeout( () => {
            this.msg_alert = '';
        }, 2000);

    }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from './../../../@core/services/email.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-admin-email-address-dialog',
    templateUrl: './admin-email-address-dialog.html',
    styleUrls: ['./admin-email-address-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class AdminEmailAddressDialog implements OnInit {

    emails: Array<any> = [];
    emailTail: string = '@triamnetwork.com';
    newEmail: string = '';

    waitResponse: boolean = false;
    addingEmail: boolean = false;
    msg_alert: string = '';
    type_alert: string = 'success';

    constructor(
        private router: Router,
    	private emailService: EmailService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
        this.getAdminEmailAddresses();
    }

    async getAdminEmailAddresses(){
        this.waitResponse = true;
        let response = await this.emailService.getAdminEmailAddresses();
        this.waitResponse = false;
        if(!response.success){
            return;
        }
        response.result.forEach( (email) => {
            this.emails.push({address: email});
        });
    }

    async addNewEmail() {
        let emailAddress = this.newEmail + this.emailTail;
        //-- check whether this email is existed in the array
        var existed = this.emails.some( (email) => {
            if (email.address === emailAddress) return true;
        });
        if (existed) {
            this.type_alert = 'danger';
            this.msg_alert = this.t.transform('EMAIL_EXISTED_ERROR');
        }
        else {
            this.addingEmail = true;
            let response = await this.emailService.addAdminEmailAddress(this.newEmail);
            this.addingEmail = false;
            if(!response.success){
                this.type_alert = 'danger';
                return this.msg_alert = this.t.transform(errors[response.error.errorCode]);
            }
            this.emails.push({address: emailAddress});
            this.newEmail = '';
        }
    }

    removeEmailAddress(email) {
        swal({
            title: this.t.transform('confirm_'),
            text: `${this.t.transform('do_you_want_to_remove')}? ${email.address} ${this.t.transform('you_will_no_longer_receive_email_to_this_address')}`,
            showCancelButton: true,
            confirmButtonText: this.t.transform('yes_delete'),
            cancelButtonText: this.t.transform('cancel'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                let data = {
                    emailAddress: email.address,
                    removeFiles: email.removeFiles
                }
                this.emailService.removeAdminEmailAddress(data).then(
                    (response) => {
                        if(!response.success){
                            swal(
                                this.t.transform(errors[response.error.errorCode]),
                                '',
                                'error'
                            );
                            return;
                        }
                        let index = this.emails.findIndex( (e) => {
                            return e.address === email.address;
                        });
                        if (index >= 0) this.emails.splice(index, 1);
                    }
                )
            }
        });

    }
}

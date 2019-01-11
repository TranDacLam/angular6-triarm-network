import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { UserService } from '../../@core/services/user.service';
import { errors } from './../../@core/common/error-code';
import { TranslatePipe } from './../../@theme/pipes/translate.pipe';

@Component({
    templateUrl: './forgot-password.html',
    styleUrls: ['./forgot-password.scss']
})

// tslint:disable-next-line:component-class-suffix
export class ForgotPasswordPage implements OnInit {

    formForgotPassword: FormGroup;
    formResetPassword: FormGroup;
    sentEmail = false;
    processing = false;
    msg_error = '';
    showSuccess = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
        this.createFormSendMail();
        this.createFormResetPassword();
    }

    createFormSendMail(): void {
        this.formForgotPassword = this.fb.group({
            emailSend: ['', [Validators.required, Validators.email]]
        });
    }

    createFormResetPassword(): void {
        this.formResetPassword = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            code: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(200)]],
            repassword: ['']
        }, {validator: this.matchPassword});
    }

    matchPassword(c: AbstractControl) {
        if (c.get('newPassword').value !== c.get('repassword').value) {
            return c.get('repassword').setErrors({'incorrect': true});
        }
        return null;
    }

    async sendCodeResetPassword() {
        this.processing = true;
        const response = await this.userService.forgotPassword(this.formForgotPassword.value.emailSend);
        this.processing = false;
        if (!response.success) {
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }
        this.formResetPassword.get('email').setValue(this.formForgotPassword.value.emailSend);
        this.sentEmail = true;
        this.msg_error = '';
    }

    onHaveCode() {
        this.sentEmail = true;
        this.msg_error = '';
        this.formResetPassword.get('email').setValue(this.formForgotPassword.value.emailSend);
    }

    async resetPassword() {
        this.processing = true;
        const response = await this.userService.resetPassword(this.formResetPassword.value);
        this.processing = false;
        if (!response.success) {
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }
        this.msg_error = '';
        this.showSuccess = true;
    }

}

import {Component, OnInit} from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../@core/services/user.service';
import { ApiService } from '../../@core/services/api.service';
import swal from 'sweetalert2';
import { TranslatePipe } from './../../@theme/pipes/translate.pipe';
import { TrimWhitespaceValidator } from './../../@core/validators/trim-white-space.validator';
import { errors } from './../../@core/common/error-code';

@Component({
    templateUrl: './new-account.html',
    styleUrls: ['./new-account.scss']
})

// tslint:disable-next-line:component-class-suffix
export class NewAccountPage implements OnInit {

    formNewAccount: FormGroup;

	stepProcessing: Array<boolean> = [false, true, true, true];
	stepActive: Array<boolean> = [false, true, true, true];
    skipGA: boolean = false;
    gaStep: number = null;
    gaSecret: string = '';
    gaConfirmCode: string = '';
    backupConfirmed: boolean = false;
    gettingGA: boolean = false;
    verifyingGA: boolean = false;
    gaQRData: string = '';

    processing = false;
    codeEmail = '';

    msg_error = '';

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private apiService: ApiService,
        private t: TranslatePipe,
    ) {
    }

    ngOnInit() {
        this.createForm();
    }

    createForm(): void {
        this.formNewAccount = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            firstname: ['', [Validators.required, Validators.maxLength(200), TrimWhitespaceValidator.trimWhitespaceValidator]],
            middlename: [''],
            lastname: ['', [Validators.required, Validators.maxLength(200), TrimWhitespaceValidator.trimWhitespaceValidator]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(200)]],
            repassword: [''],
        }, {validator: this.matchPassword});
    }

    matchPassword(c: AbstractControl) {
        if (c.get('password').value !== c.get('repassword').value) {
            return c.get('repassword').setErrors({'incorrect': true});
        }
        return null;
    }

    async nexStep1() {
        this.processing = true;
        let response = await this.userService.signUp(this.formNewAccount.value);
        this.processing = false;
        if(!response.success){
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }
        // login get token
        await this.loginGetToken();
        // Get user info
        await this.getUserInfo();

        this.stepProcessing[0] = true;
        this.stepProcessing[1] = false;
        this.stepActive[1] = false;
        this.msg_error = '';
    }

    async nexStep2() {
        this.processing = true;
        let response = await this.userService.verifyEmail(this.codeEmail);
        this.processing = false;
        if(!response.success){
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }
        this.userService.current_user.verifyEmail = true;
        this.stepProcessing[1] = true;
        this.stepProcessing[2] = false;
        this.stepActive[2] = false;
        this.msg_error = '';
    }

    nexStep3(){
        this.stepProcessing[2] = true;
        this.stepProcessing[3] = false;
        this.stepActive[3] = false;
    }

    async loginGetToken() {
        // login
        const data_login: any = {};
        data_login['email'] = this.formNewAccount.value.email;
        data_login['password'] = this.formNewAccount.value.password;
        data_login['timestamp'] = new Date();
        let response = await this.apiService.login(data_login);
        if(!response.success){
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }

    }

    async getUserInfo(){
        //login
        let response = await this.userService.getUserInfo();
        if(!response.success){
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }
    }

    async resendMail() {
        this.processing = true;
        this.codeEmail = '';
        let response = await this.userService.resendVerifyEmail();
        this.processing = false;
        if (!response.success) {
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }
        swal(
            this.t.transform('NEW_MAIL_SENT'),
            '',
            'success'
        );
    }

    async setupGA(){
        if (!this.gaSecret) {
            this.gettingGA = true;
            let response = await this.userService.setGaSecret(this.formNewAccount.value.password);
            this.gettingGA = false;
            if(!response.success){
                return this.msg_error = this.t.transform(errors[response.error.errorCode]);
            }
            this.msg_error = '';
            this.gaQRData = response.result.qrData;
            this.gaSecret = response.result.gaSecret;
            this.gaStep = 1;
        }
        else {
            this.verifyingGA = true;
            let data_verify_ga:any = {};
            data_verify_ga['code'] = this.gaConfirmCode;
            data_verify_ga['password'] = this.formNewAccount.value.password;
            let response = await this.userService.verifyGa(data_verify_ga);
            this.verifyingGA = false;
            if(!response.success){
                return this.msg_error = this.t.transform(errors[response.error.errorCode]);
            }
            this.msg_error = '';
            this.userService.current_user.tfaEnabled = true;
            this.userService.current_user.verifyGA = true;
            this.userService.current_user.tfaMethod = 1;
            this.gaStep = 2;
        }
    }

}

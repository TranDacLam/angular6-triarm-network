import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from './../../../@core/services/user.service';
import { Helper } from './../../../@core/common/helper';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { ApiService } from './../../../@core/services/api.service';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-change-password-dialog',
    templateUrl: './change-password-dialog.html',
    styleUrls: ['./change-password-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class ChangePasswordDialog implements OnInit {

    @Output() changeSubmit = new EventEmitter();

    formChangePassword: FormGroup;
    processing: boolean = false;
    msg_alert: string = '';
    type_alert: string = 'danger';

    constructor(
    	private userService: UserService,
    	public helper: Helper,
        private fb: FormBuilder,
        private t: TranslatePipe,
        private router: Router,
        private api: ApiService
    ) {
    }

    ngOnInit() {
        this.createForm();
    }

    createForm(): void {
        this.formChangePassword = this.fb.group({
            password: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            repeatNewPassword: ['', [Validators.required]],
        }, {validator: this.matchPassword});
    }

    matchPassword(c: AbstractControl) {
        if (c.get('newPassword').value !== c.get('repeatNewPassword').value) {
            return c.get('repeatNewPassword').setErrors({'incorrect': true});
        }
        return null;
    }

    async onSubmit(){
        this.processing = true;
        let data: any = {};
        data['oldPassword'] = this.formChangePassword.value.password;
        data['newPassword'] = this.formChangePassword.value.newPassword;
        let response = await this.userService.changePassword(data);
        this.processing = false;
        if(!response.success){
            this.type_alert = 'danger';
            return this.msg_alert = this.t.transform(errors[response.error.errorCode]);
        }
        swal(
            this.t.transform('CHANGE_PASSWORD_SUCCESS'),
            '',
            'success'
        );
        this.formChangePassword.reset();
        this.api.logout();
        this.userService.current_user = null;
        this.router.navigate(['/login']);

    }

}

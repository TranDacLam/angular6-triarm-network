import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { UserService } from './../../../@core/services/user.service';
import { Helper } from './../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-edit-user-info-dialog',
    templateUrl: './edit-user-info-dialog.html',
    styleUrls: ['./edit-user-info-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class EditUserInfoDialog implements OnInit, OnChanges {

    @Output() changeSubmit = new EventEmitter();
    @Input() user_detail: any;
    @Input() is_edit_email: boolean;

    msg_error: string = '';

    email: string = '';
    firstname: string = '';
    middlename: string = '';
    lastname: string = '';

    constructor(
    	private userService: UserService,
    	public helper: Helper
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(){
        if(this.user_detail){
            this.setUser();
        }
    }

    Ok(){
        let data = {
            email: this.email,
            firstname: this.firstname,
            middlename: this.middlename,
            lastname: this.lastname
        }
        this.changeSubmit.emit(data);
        $('#editUserInfo').modal('hide');
        this.setUser();
    }

    setUser(){
        this.email = this.user_detail.email;
        this.firstname = this.user_detail.firstname;
        this.middlename = this.user_detail.middlename;
        this.lastname = this.user_detail.lastname;
    }
}

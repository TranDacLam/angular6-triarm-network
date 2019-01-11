import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../../../@core/services/user.service';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import { errors } from './../../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './resend-email.html',
    styleUrls: ['./resend-email.scss']
})

export class ResendEmailComponent implements OnInit {

	allUsers: Array<any> = [];
	totalUsers: number = 0;
	limit: number = 0;
	currentPage: number = 1;
	currentItems: Array<any> = [];
	waitTableData: boolean = false;
	waitingChange: boolean = false;

	searchEmailInput: string = '';
	msg_alert: string = '';

    constructor(
    	private router: Router,
    	private userService: UserService,
        private t: TranslatePipe,
    ) {}

    ngOnInit() {
    	this.getAllUserSubSystemInfo(0, '');
    }

    async getAllUserSubSystemInfo(skipUsers, searchInput){
    	this.waitTableData = true;
    	this.allUsers = [];
    	let data = {
    		skipUsers,
    		searchInput
    	}
    	let response = await this.userService.getAllUserSubSystemInfo(data);
    	if(!response.success){
    		return;
    	}
    	this.waitTableData = false;
    	this.allUsers = response.result.allUser.filter((user) => {
			return (user.userClass.indexOf(999) < 0);
		});
		this.totalUsers = response.result.totalUsers;
		this.limit = response.result.limitUsers;
    }

    pageChanged(event){
    	if(this.currentPage != event.page){
	        this.currentPage = event.page;
	        this.getAllUserSubSystemInfo((this.currentPage - 1) * this.limit, this.searchEmailInput);
    	}
	}

    searchByEmail(){
    	this.currentPage = 1;
    	this.getAllUserSubSystemInfo(0, this.searchEmailInput);
    }

    checkChange(id){
		this.waitingChange = true;
		this.allUsers.forEach((user) => {
			if(user._id === id){
				if(user.selected)
					user.selected = true;
				else
					user.selected = false;
			}
		});
		this.waitingChange = false;
	};

	checkAll(status){
		this.waitingChange = true;
		this.allUsers.forEach(function(user){
			user.selected = status;
		});
		this.waitingChange = false;
	};

	async sendEmail() {
		swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('do_yout_want_sent_email_to_selected_users'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('ok_'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
            	this.waitingChange = true;
            	let listUser = [];
            	this.allUsers.forEach((user) => {
					if(user.selected)
						listUser.push(user._id);
				});
                this.userService.resendEmailUserInfo(listUser).then(
                    (data) => {
                    	this.waitingChange = false;
                    	if(!data.success){
                            swal(
                                this.t.transform(errors[data.error.errorCode]),
                                '',
                                'error'
                            );
                    		return;
                    	}
                    	this.msg_alert = this.t.transform('done');
                    }
                )
            }
        });

	}
}

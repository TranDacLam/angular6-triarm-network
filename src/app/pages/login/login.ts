import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ApiService} from "../../@core/services/api.service";
import {UserService} from "../../@core/services/user.service";
import { SocketService } from './../../@core/services/socket.service';
import swal from 'sweetalert2';

declare var $: any;

@Component({
  	templateUrl: './login.html',
  	styleUrls: ['./login.scss']
})

// tslint:disable-next-line:component-class-suffix
export class LoginPage implements OnInit {


	formLogin: FormGroup;
	msg_error: string = '';
	processing: boolean = false;
	// siteKeyRecapcha: string = '';

	code_tfa: string = '';
	option_extra: any;


  	constructor(
  		private api: ApiService,
	    private router: Router,
	    public userService: UserService,
	    private fb: FormBuilder,
	    private route: ActivatedRoute,
	    private socketService: SocketService
  	) {
  	}

  	ngOnInit() {
  		this.createForm();
        this.route.params.subscribe(params => {
            if (params.message) {
                this.msg_error = params.message;
            }
        });
  	}

  	createForm(): void {
  		// this.siteKeyRecapcha = environment.CAPTCHA_SITE_KEY;
	    this.formLogin = this.fb.group({
	      	email: ['', [Validators.required]],
	      	password: ['', [Validators.required]],
	      	// recaptcha: [null, [Validators.required]],
	    });
	}

	async login(){
	    this.processing = true;
	    let data: any = {};
	    data['email'] = this.formLogin.value.email;
	    data['password'] = this.formLogin.value.password;
	    data['timestamp'] = new Date();
	    data['code'] = this.code_tfa;
      data['ip'] = this.userService.ip_address || '';
	    let response = await this.api.login(data);
	    this.option_extra = response.extra;
	    this.processing = false;
	    if(!response.success){
	      	this.formLogin.reset();
	      	this.code_tfa = '';
	      	return this.msg_error = response.error.errorMessage;
	    }
	    this.msg_error = '';
	    if (!response.extra.loginTFARequire || (response.extra.loginTFARequire && response.extra.verifyTFA)){
	      	let response_info_user = await this.userService.getUserInfo();
	      	if(!response_info_user.success){
		      	swal(
		            response.error.errorMessage,
		            '',
		            'error'
	          	);
	          	this.userService.current_user = null;
	          	this.api.logout();
	          	return this.router.navigate(['/login']);
		    }
		    await this.socketService.initSocket();
      		await this.socketService.rootSub();
		    return this.router.navigate(['/wallet']);
	    }else{
	    	$('#tfaConfirmDialog').modal('show');
	    }
  	}

  	onTfaConfirm(event){
  		this.code_tfa = event;
  		this.login();
  	}

}

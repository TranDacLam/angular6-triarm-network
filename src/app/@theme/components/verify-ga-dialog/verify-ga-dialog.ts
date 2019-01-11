import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssuerService } from './../../../@core/services/issuer.service';
import { UserService } from './../../../@core/services/user.service';
import { Helper } from './../../../@core/common/helper';
import { TranslatePipe } from './../../pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';

declare var $: any;

@Component({
    selector: 'app-verify-ga-dialog',
    templateUrl: './verify-ga-dialog.html',
    styleUrls: ['./verify-ga-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class VerifyGaDialog implements OnInit {

    @Output() change_verify_ga = new EventEmitter();

    processing: boolean = false;
    msg_error: string = '';

    qrCode: string = "";
    qrData: string = "";
    qrGASecret: string = "";
    qrCodeGenerated: boolean = false;
    showGA: boolean = false;
    password: string = '';
    showContent: boolean = false;
    backupConfirmed: boolean = false;
    regenProcessing: boolean = false;
    verifyProcessing: boolean = false;
    tfaVerified: boolean = false;


    constructor(
    	private issuerService: IssuerService,
    	public helper: Helper,
        private userService: UserService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
      
    }

    OK(){
        $('#verifyGaDialog').modal('hide');
        this.change_verify_ga.emit(true);
    }

    async regenQRCode(){
        this.regenProcessing = true;
        let response = await this.userService.setGaSecret(this.password)
        this.regenProcessing = false;
        if(!response.success){
            this.password = '';
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }
        this.msg_error = '';
        this.qrCode = "";
        this.qrCodeGenerated = true;
        this.qrData = response.result.qrData;
        this.qrGASecret = response.result.gaSecret;
        this.showContent = true;
    }

    async verifyGA(){
        this.verifyProcessing = true;
        let data = {
            code: this.qrCode,
            password: this.password
        }
        let response = await this.userService.verifyGa(data);
        this.verifyProcessing = false;
        if(!response.success){
            return this.msg_error = this.t.transform(errors[response.error.errorCode]);
        }
        this.msg_error = '';
        this.tfaVerified = true;
    }
}

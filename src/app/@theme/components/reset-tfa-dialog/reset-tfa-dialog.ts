import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssuerService } from './../../../@core/services/issuer.service';
import { Helper } from './../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-reset-tfa-dialog',
    templateUrl: './reset-tfa-dialog.html',
    styleUrls: ['./reset-tfa-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class ResetTfaDialog implements OnInit {

    @Output() changeSubmit = new EventEmitter();
    @Input() title: string;
    @Input() message: string;
    @Input() type: string;
    codeValue: string = '';
    passwordValue: string = '';

    processing: boolean = false;
    msg_error: string = '';

    constructor(
    	private issuerService: IssuerService,
    	public helper: Helper
    ) {
    }

    ngOnInit() {
      
    }

    OK(){
        $('#resetTfaDialog').modal('hide');
        let data = {
            'code': this.codeValue,
            'password': this.passwordValue
        }
        this.changeSubmit.emit(data);
        this.codeValue = '';
        this.passwordValue = '';
    }
}

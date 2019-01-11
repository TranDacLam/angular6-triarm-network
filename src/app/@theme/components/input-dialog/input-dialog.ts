import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssuerService } from './../../../@core/services/issuer.service';
import { Helper } from './../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-input-dialog',
    templateUrl: './input-dialog.html',
    styleUrls: ['./input-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class InputDialog implements OnInit {

    @Output() changeSubmit = new EventEmitter();
    @Input() title: string;
    @Input() message: string;
    @Input() type: string;
    inputValue: string = '';

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
        $('#inputDialog').modal('hide');
        this.changeSubmit.emit(this.inputValue);
        this.inputValue = '';
    }
}

import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-disable-payment-dialog',
    templateUrl: './disable-payment-dialog.html',
    styleUrls: ['./disable-payment-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class DisablePaymentDialogComponent implements OnInit {

    @Input() options: any;
	@Output() on_disable_payment_dialog = new EventEmitter();


    constructor(
    ) {
    }

    ngOnInit() {
    }

    OK(){
        this.on_disable_payment_dialog.emit();
        $('#disablePaymentDialog').modal('hide');
    }

}

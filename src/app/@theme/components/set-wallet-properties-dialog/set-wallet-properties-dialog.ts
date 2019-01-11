import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-set-wallet-properties-dialog',
    templateUrl: './set-wallet-properties-dialog.html',
    styleUrls: ['./set-wallet-properties-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class SetWalletPropertiesDialogComponent implements OnInit {

	@Output() on_set_wallet_properties = new EventEmitter();

    authRequired: boolean = false;

    constructor(
    ) {
    }

    ngOnInit() {
    }

    OK(){
    	let options = 0x00;
        // if (this.authRevocable) options = options ^ 0x01;
        if (this.authRequired) options = options ^ 0x02;
        this.on_set_wallet_properties.emit(options);
        $('#setWalletPropertiesDialog').modal('hide');
    }

    close(){
        this.authRequired = false;
        $('#setWalletPropertiesDialog').modal('hide');
    }

}

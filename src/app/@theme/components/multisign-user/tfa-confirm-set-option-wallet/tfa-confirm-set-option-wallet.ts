import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-tfa-confirm-set-option-wallet',
    templateUrl: './tfa-confirm-set-option-wallet.html',
    styleUrls: ['./tfa-confirm-set-option-wallet.scss']
})

// tslint:disable-next-line:component-class-suffix
export class TfaConfirmSetOptionWallet implements OnInit {

  // Duplicate modal tfa page wallet multisign

	@Input() option_extra;
	@Input() email: string;
	@Output() on_confirm = new EventEmitter();
	processing: boolean = false;
	code: string = '';

    constructor(
    ) {
    }

    ngOnInit() {
      $('#TfaConfirmSetOptionWallet').on('hidden.bs.modal', (e) => {
        setTimeout(() =>{
          this.code = '';
        }, 500)
      })
    }

    onConfirm(){
    	this.on_confirm.emit(this.code);
        this.code = '';
    	$('#TfaConfirmSetOptionWallet').modal('hide');
    }

}

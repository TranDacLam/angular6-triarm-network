import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-tfa-confirm',
    templateUrl: './tfa-confirm.component.html',
    styleUrls: ['./tfa-confirm.component.scss']
})

// tslint:disable-next-line:component-class-suffix
export class TfaConfirmComponent implements OnInit {

	@Input() option_extra;
	@Input() email: string;
	@Output() on_confirm = new EventEmitter();
	processing: boolean = false;
	code: string = '';

    constructor(
    ) {
    }

    ngOnInit() {
      $('#tfaConfirmDialog').on('hidden.bs.modal', (e) => {
        setTimeout(() =>{
          this.code = '';
        }, 500)
      })
    }

    onConfirm(){
    	this.on_confirm.emit(this.code);
        this.code = '';
    	$('#tfaConfirmDialog').modal('hide');
    }

}

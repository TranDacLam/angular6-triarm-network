import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-choose-signer-dialog',
    templateUrl: './choose-signer-dialog.html',
    styleUrls: ['./choose-signer-dialog.scss']
})

export class ChooseSignerDialogComponent implements OnInit, OnChanges {

    @Output() on_choose_signer_dialog = new EventEmitter();
	@Input() options: any;
    signers: Array<any> = [];
    mySigners: Array<any> = [];
    isConfirmMode: boolean;
    selectedSigner: any = null;

    constructor(
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(){
        if(this.options){
            this.signers = this.options.signers
            this.mySigners = this.signers.filter((signer) => {
                return signer.isOwned;
            });
            this.isConfirmMode = this.mySigners.length === 1;
            this.selectedSigner = this.mySigners.length === 1 ? this.mySigners[0].public_key : null;
        }
    }

    OK(){
        this.on_choose_signer_dialog.emit({public_key: this.selectedSigner});
        $('#chooseSignerDialog').modal('hide');
    }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-private-key-dialog',
    templateUrl: './private-key-dialog.html',
    styleUrls: ['./private-key-dialog.scss']
})

export class PrivateKeyDialog implements OnInit {

    @Output() on_private_key_dialog = new EventEmitter();
    @Input() wallet: any;
    @Input() type: string;

    key1: string = '';
    key2: string = '';
    key3: string = '';

    constructor(
    ) {
    }

    ngOnInit() {
    }

    OK(){
        let data = {key1: this.key1, key2: this.key2, key3: this.key3}
        this.on_private_key_dialog.emit(data);
        this.key1 = '';
        this.key2 = '';
        this.key3 = '';
        $('#privateKeyDialog').modal('hide');
    }

    showHidden(){

    }
}

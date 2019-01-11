import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-summary-dialog',
    templateUrl: './summary-dialog.html',
    styleUrls: ['./summary-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class SummaryDialogComponent implements OnInit {

	@Input() data: any;
	qrMode: boolean = true;

    constructor(
    ) {
    }

    ngOnInit() {
    }

    toggleText(){
    	this.qrMode = !this.qrMode;
    }
}

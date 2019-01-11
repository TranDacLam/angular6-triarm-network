import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-alert-messages',
    templateUrl: './alert-messages.component.html',
    styleUrls: ['./alert-messages.component.scss']
})

export class AlertMessagesComponent implements OnInit {

    @Output() valueChange = new EventEmitter();
    @Input() messages_alert: string;
    @Input() type: string;

    constructor(
    ) {
    }

    ngOnInit() {
    }

    closeAlert() {
        this.valueChange.emit('');
    }

}

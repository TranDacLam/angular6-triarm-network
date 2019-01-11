import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit {

    @Input()
    get value() {
        return this.inputValue;
    }

    @Output() valueChange = new EventEmitter();
    @Input() placeholder = '';
    @Input() disabled;
    @Input() type: string;
    @Input() title: string;
    @Input() form_control_name: string;
    @Input() form: FormGroup;
    @Input() isValid;

    private inputValue = '';

    ngOnInit() {
    }

    constructor() {
    }

    set value(val) {
        this.inputValue = val;
        this.valueChange.emit(this.inputValue);
    }
}

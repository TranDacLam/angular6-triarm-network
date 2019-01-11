import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'show-error-valid',
    templateUrl: './show-error-valid.component.html',
    styleUrls: ['./show-error-valid.component.scss']
})
export class ShowErrorValidComponent implements OnInit {

    /*
        Purpose: show message error in form
        Author: Lam
    */

    // Type and message validate
    private static readonly errorMessages = {
        'email': () => 'Email invalid format',
        'required': () => 'This field is required',
        'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
        'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
        'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
        'fomatTime': () => 'Please enter the correct time format HH:mm',
    };

    @Input()
    private control: AbstractControlDirective | AbstractControl;

    constructor() { }

    ngOnInit() {
    }

    /*
        Function shouldShowErrors(): check have error, user dirty or touched
        Author: Lam
    */
    shouldShowErrors(): boolean {
        return this.control && this.control.errors &&
            (this.control.dirty || this.control.touched);
    }

    /*
        Function shouldShowErrors(): show list errors
        Author: Lam
    */
    listOfErrors(): string[] {
        return Object.keys(this.control.errors)
            .map(field => this.getMessage(field, this.control.errors[field]));
    }

    /*
        Function getMessage(): callback function errorMessages() get error
        Author: Lam
    */
    private getMessage(type: string, params: any) {
        return ShowErrorValidComponent.errorMessages[type](params);
    }

}

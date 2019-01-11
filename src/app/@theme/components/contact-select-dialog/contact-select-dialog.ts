import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from './../../../@core/services/user.service';

declare var $: any;

@Component({
    selector: 'app-contact-select-dialog',
    templateUrl: './contact-select-dialog.html',
    styleUrls: ['./contact-select-dialog.scss']
})

export class ContactSelectDialog implements OnInit {

    @Output() on_contact_select_dialog = new EventEmitter();
    contacts: Array<any> = [];
    waitResponse: boolean = false;
    selectedContact: any = null;

    constructor(
    	private userService: UserService
    ) {
    }

    ngOnInit() {
       this.getAllUserContacts();
    }

    async getAllUserContacts(){
        this.waitResponse = true;
        let response = await this.userService.getAllUserContacts();
        this.waitResponse = false;
        if(!response.success){
            return;
        }
        this.contacts = response.result;
    }

    OK() {
        this.on_contact_select_dialog.emit(this.selectedContact.address);
        $('#contactSelectDialog').modal('hide');
    };
}

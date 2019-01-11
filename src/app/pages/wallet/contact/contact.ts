import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../@core/services/user.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

@Component({
    templateUrl: './contact.html',
    styleUrls: ['./contact.scss']
})

export class ContactComponent implements OnInit {

	contacts: Array<any>  = [];
	msg_alert: string = '';
	type_alert: string = 'danger';

	contact_edit_pre: any = null;

    constructor(
    	private userService: UserService,
    	private t: TranslatePipe
    ) {}

    ngOnInit() {
    	this.getAllUserContacts();
    }

    async getAllUserContacts(){
    	let response = await this.userService.getAllUserContacts();
    	if(!response.success){
    		return;
    	}
    	this.contacts = response.result;
    }

    addContact() {
	    let contact;
	    for (let i = 0; i < this.contacts.length; i++) {
	      	if (this.contacts[i]._id === 0) {
	        	contact = this.contacts[i];
	        	break;
	      	}
	    }
	    if (!contact) {
	      	contact = {_id: 0, name: "", address: "", isCRU: true};
	      	this.contacts.push(contact);
	    }
  	}

  	removeNewContact(contact) {
  		let removeIndex = this.contacts.findIndex((c) => {
        	return c._id === contact._id;
     	});
	    if (contact._id === 0) {
	      	if (removeIndex >= 0) this.contacts.splice(removeIndex, 1);
	    }else{
	    	this.contacts[removeIndex] = this.contact_edit_pre;
	    	this.contacts[removeIndex].isCRU = false;
	    }
 	}

 	async saveContact(contact){
 		if (!!contact.name && !!contact.address && contact.address.length === 56) {
	      	contact.isBeingSaved = true;
	      	let data = {
	      		contactId: contact._id,
	      		name: contact.name, 
	      		address: contact.address
	      	}
	      	let response = null;
	      	if(contact._id !== 0){
	      		response = await this.userService.editUserContact(data);
	      	}else{
	      		response = await this.userService.createUserContact(data);
	      	}
	      	contact.isBeingSaved = false;
	      	if(!response.success){
	      		this.removeNewContact(contact);
	      		this.type_alert = 'danger';
	      		return this.msg_alert = this.t.transform(errors[response.error.errorCode]);
	      	}
	      	this.type_alert = 'success';
            this.msg_alert = contact._id !== 0 ? this.t.transform('update_contact_success') : this.t.transform('create_contact_success');
	      	contact._id = response.result;
	      	contact.isCRU = false;
	    }
	    else {
	    	swal(
	    		this.t.transform('WRONG_ADDRESS_VALUE'),
	    		'',
	    		'error'
	    	);
	      	this.removeNewContact(contact);
	    }
 	}

 	removeContact(contact) {
 		swal({
            title: this.t.transform('confirm'),
            text: this.t.transform('CONFIRM_REMOVE_CONTACT'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('yes_delete'),
            cancelButtonText: this.t.transform('cancel'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value && contact._id !== 0) {
            	contact.isBeingRemoved = true;
            	let data = {
            		contactId: contact._id
            	}
            	let response = this.userService.removeUserContact(data).then(
            		(response) => {
            			contact.isBeingRemoved = false;
		            	if(!response.success){
		            		swal(
					    		this.t.transform(errors[response.error.errorCode]),
					    		'',
					    		'error'
					    	);
		            		return;
		            	}
		            	let removeIndex = this.contacts.findIndex((c) => {
			                return c._id === contact._id;
			            });
			            if (removeIndex >= 0) this.contacts.splice(removeIndex, 1);
		            	swal(
				    		this.t.transform('remove_contact_success'),
				    		'',
				    		'success'
				    	);
            		},
            		(error) => {
            			contact.isBeingRemoved = false;
            		}
            	);
            }
        });
	}

	editContact(contact){
		var index = this.contacts.findIndex((c) => {
            return c._id === contact._id;
        });
        if (index >= 0){
        	this.contacts[index].isCRU = true;
        	this.contact_edit_pre = {...this.contacts[index]};
        }
	}
}

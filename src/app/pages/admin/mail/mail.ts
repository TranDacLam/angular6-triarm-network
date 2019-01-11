import { Component, OnInit } from '@angular/core';
import { EmailService } from './../../../@core/services/email.service';
import * as moment from 'moment';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './mail.html',
    styleUrls: ['./mail.scss']
})

export class MailComponent implements OnInit {

	currentThreadPage: number = 1;
	threadsPerPage: number = 6;
	showMode: string = 'inbox';

	adminMailBoxes: Array<any> = [];
	adminEmailAddresses: Array<any> = [];
	selectedAdminEmailAddresses: Array<any> = [];
	filteredThreads: Array<any> = [];
	unreadThreads: Array<any> = [];
	otherThreads: Array<any> = [];
	unreadThreadCount: number = 0;
	selectedThread: any = null;
	options_reply: any = null;

	waitResponse: boolean = false;
	waitMessage: string = '';

	filterSettings: any = {};

    constructor(
    	private emailService: EmailService
    ) {}

    ngOnInit() {
    	this.filterSettings = {
    		singleSelection: false, 
            text:"Select Email",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            classes:"valign-center filter-email",
            labelKey: 'email'
    	};
    	this.reloadEmails();
    	$(document).on('hidden.bs.modal', '#adminEmailAddressDialog', () => {
    		this.reloadEmails();
    	});
    }

    async reloadEmails(){
    	this.waitResponse = true;
    	this.waitMessage = 'Loading your emails';
    	let response = await this.emailService.getAdminEmailInboxes();
    	this.waitResponse = false;
    	if(!response.success){
    		console.log(response.error.errorMessage);
    		return;
    	}
    	let mailboxes = response.result;
    	this.adminMailBoxes = mailboxes;
    	let index_mail = 1;
    	this.adminMailBoxes.forEach((mailbox) => {
			this.adminEmailAddresses.push({id: index_mail, email: mailbox.email});
			if (mailbox.body && mailbox.body.threads) {
				mailbox.body.threads.forEach((thread) => {
					thread.mailbox = mailbox.email;
				});
			}
			index_mail++;
		});
		
		this.selectedAdminEmailAddresses = [];
		this.adminEmailAddresses.forEach((emailAddress) => {
			this.selectedAdminEmailAddresses.push(emailAddress);
		});

		this.filterEmails();
    }

    filterEmails(){
    	this.filteredThreads = [];
    	this.unreadThreads = [];
    	this.otherThreads = [];
    	this.unreadThreadCount = 0;
    	this.selectedAdminEmailAddresses.forEach((emailAddress) => {
			this.adminMailBoxes.some((mailbox) => {
				if (mailbox.email === emailAddress) {
					// console.log(mailbox.email, emailAddress);
					//-- add all email into filteredThreads
					if (mailbox.body && mailbox.body.threads) {
						mailbox.body.threads.forEach((thread) => {
							if (thread.newEmails && thread.newEmails.length > 0) {
								this.unreadThreadCount++;
							}
							if (this.showMode === "inbox") {
								if (thread.newEmails && thread.newEmails.length > 0) {
									this.unreadThreads.push(thread);
								}
								else {
									this.otherThreads.push(thread);
								}
							}
							if (this.showMode === "flagged" && thread.flagged) this.filteredThreads.push(thread);
							if (this.showMode === "sent" && thread.emails && thread.emails[0] && this.containElement(thread.emails[0].from, this.selectedAdminEmailAddresses)) this.filteredThreads.push(thread);
						});
					}
					return true;
				}
			});
		});

		//-- sort by date
		let sortByDate = (thread1, thread2) => {
			if (thread1.emails && thread1.emails.length && thread2.emails && thread2.emails.length){
				return moment(thread2.emails[thread2.emails.length-1].receivedDate).toDate().valueOf() - moment(thread1.emails[thread1.emails.length-1].receivedDate).toDate().valueOf();
			}
			else{
				return 1;
			}
		};
		// console.log(this.filteredThreads);
		this.filteredThreads.sort(sortByDate);
		this.unreadThreads.sort(sortByDate);
		this.otherThreads.sort(sortByDate);
    }

    containElement(array1, array2) {
		if (array2) {
			return array2.some(function (e) {
				if (array1 && (array1.indexOf(e) >= 0))
					return true;
			});
		}
		return false;
	};

    getSenderName(mail) {
    	let senderExtractRegex = new RegExp("([^<>]*)<?(([^<\\s]*)@[^>]*)>?")
		var result = senderExtractRegex.exec(mail);
		// console.log(result);
		return (result[1] ? result[1].trim() : "") || result[3];
	}
	
	changeShowMode(mode) {
		if (!this.waitResponse) {
			this.hideThread();
			this.showMode = mode;
			this.filterEmails();
		}
	}
	
	hideThread() {
		this.selectedThread = null;
		//-- might update email
		this.filterEmails();
	}
	
	showThread(thread) {
		if (!thread.isBeingRemoved) {
			this.selectedThread = thread;
		}
	}

	openMailAddressDialog(){

	}

	getFromNow(time) {
		return moment(Date.parse(time)).fromNow();
	};
	
	isUnreadEmail(thread, email) {
		if (thread.newEmails)
			return thread.newEmails.findIndex((id) => {
				return id.localId === email.id.localId
			}) >= 0;
		else
			return false;
	};

	async deleteThread(thread) {
		let confirm = 'Do you want to remove all emails in this conversation? This action cannot be undone.';
		if (confirm) {
			this.selectedThread = null;
			thread.isBeingRemoved = true;
			let data_email = {
					mailbox: thread.mailbox,
					threadId: thread.emailIds[0]
				}

			let response = await this.emailService.removeEmailThread(data_email);
			if(!response.success){
				return;
			}
			this.adminMailBoxes.some((mailbox) => {
				if (mailbox.email === thread.mailbox) {
					var threadIndex = mailbox.body.threads.findIndex((iThread) => {
						if (iThread.emailIds && iThread.emailIds[0]) {
							return iThread.emailIds[0].localId === thread.emailIds[0].localId;
						}
					});
					if (threadIndex >= 0) mailbox.body.threads.splice(threadIndex, 1);
					return true;
				}
			});
			
			this.hideThread();
		}
	};

	async flagThread(thread) {
		if (!thread.isBeingRemoved) {
			thread.flagged = !thread.flagged;
			let params = {
					mailbox: thread.mailbox,
					threadId: thread.emailIds[0],
					flagged: thread.flagged
				}
			let response = await this.emailService.flagEmailThread(params);
			console.log('flagThread', response)
			if(!response.success){
				return;
			}
			thread.flagged = !thread.flagged;
		}
	};

	reply(thread, email, hasQuote, forward, to, ev){
		this.options_reply = {mode: "reply", 
			thread: thread,
			email: email, 
			hasQuote: hasQuote, 
			forward: forward, 
			to: to
		};
	}

	composeMail(sender, ev) {
		var recipients = null;
		if (this.selectedThread) {
			let recipients = [];
			this.selectedThread.emails.forEach((email) => {
				if (email.from) email.from.forEach((address) => {
					if ((this.adminEmailAddresses.indexOf(address) < 0) && (recipients.indexOf(address) < 0))
						recipients.push(address);
				});
				if (email.to) email.to.forEach((address) => {
					if ((this.adminEmailAddresses.indexOf(address) < 0) && (recipients.indexOf(address) < 0))
						recipients.push(address);
				});
			});
			this.reply(this.selectedThread, null, false, false, recipients, ev);
		}
		else {
			
		}
	};

	async toggleEmailContent(thread, email) {
		//-- load  the email content
		if (!email.content) {
			email.loadingContent = true;
			let data_email = {
				emailId: email.id
			};
			//-- check if this email is unread
			var index = this.selectedThread.newEmails.findIndex((id) => {
				return (id.localId === email.id.localId);
			});
			
			if (index >= 0) {
				data_email['setAsRead'] = true;
				data_email['mailbox'] = thread.mailbox;
				data_email['threadId'] = this.selectedThread.emailIds[0];
				
				//-- remove as newEmails from client side
				this.selectedThread.newEmails.splice(index, 1);
			}
			let response = await this.emailService.getEmailContent(data_email);
			if(!response.success){
				return;
			}
			email.content = response.result;
		}
		email.isShown = !email.isShown;
	};
}

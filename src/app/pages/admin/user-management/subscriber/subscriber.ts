import { Component, OnInit } from '@angular/core';
import { EmailService } from './../../../../@core/services/email.service';

@Component({
    templateUrl: './subscriber.html',
    styleUrls: ['./subscriber.scss']
})

export class SubscriberComponent implements OnInit {

	totalSubscriber: number = 0;
    currentPage: number = 1;
    limit: number = 50;
    listCurrentSubscribers: Array<any> = [];
    waitResponseData: boolean = false;

    constructor(
    	private emailService: EmailService
    ) {}

    ngOnInit() {
    	this.getListSubscribers(this.currentPage, this.limit);
    }

    async getListSubscribers(numPage, limit){
    	let data = {
    		numPage,
    		limit
    	}
    	this.waitResponseData = true;
    	let response = await this.emailService.getListSubscribers(data);
    	this.waitResponseData = false;
    	if(!response.success){
    		return;
    	}
    	this.totalSubscriber= response.result.totalSubscriber  ? response.result.totalSubscriber : this.totalSubscriber;
    	this.listCurrentSubscribers = response.result.subscribers;
    }

    pageChanged(event){
        if(this.currentPage != event.page){
        	this.currentPage = event.page;
        	this.getListSubscribers(this.currentPage-1, this.limit);
	    }
    }
}

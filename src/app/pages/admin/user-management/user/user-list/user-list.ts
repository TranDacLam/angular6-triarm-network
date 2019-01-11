import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../../../../@core/services/user.service';

@Component({
    templateUrl: './user-list.html',
    styleUrls: ['./user-list.scss']
})

export class UserListComponent implements OnInit {

	listUsers: Array<any> = [];
	currentItems: Array<any> = [];
	totalUser: number = 0;
	currentPage: number = 1;
	limit: number = 50;
	searchParam: string = '';
	waitResponseData: boolean = false;
	isSearch: boolean = false;
	aaaa: number = 1;

    constructor(
        private router: Router,
    	private userService: UserService
    ) {}

    ngOnInit() {
    	this.getListUser('', this.currentPage-1, this.limit);
    }

    async getListUser(searchParam, page, limit){
    	let data_params = {
    		searchParam,
    		numPage: page,
    		limit
    	}
    	this.waitResponseData = true;
    	let response = await this.userService.getListUsersInfo(data_params);
    	this.waitResponseData = false;
    	if(!response.success){
    		return;
    	}
    	this.listUsers = response.result;
    	this.totalUser = response.totalUser ? response.totalUser : this.totalUser;
    }

    search() {
		this.isSearch = true;
		this.currentPage = 1;
		this.getListUser(this.isSearch ? this.searchParam : '', this.currentPage-1, this.limit);
	};

	reloadListUser() {
		if (!this.searchParam) {
			this.isSearch = false;
			this.currentPage = 1;
			this.getListUser(this.isSearch ? this.searchParam : '', this.currentPage-1, this.limit);
		}
	};

	pageChanged(event){
        if(this.currentPage != event.page){
        	this.currentPage = event.page;
        	this.getListUser(this.isSearch ? this.searchParam : '', this.currentPage-1, this.limit);
	    }
    }

}

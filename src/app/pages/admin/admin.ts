import { Component, OnInit } from '@angular/core';
import { UserService } from './../../@core/services/user.service';

@Component({
    templateUrl: './admin.html',
    styleUrls: ['./admin.scss']
})

// tslint:disable-next-line:component-class-suffix
export class AdminPage implements OnInit {
    constructor(public userService: UserService) {
	 }

    ngOnInit() {}

}

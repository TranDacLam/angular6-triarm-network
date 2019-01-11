import {Component, OnInit} from '@angular/core';
import { UserService } from './../../@core/services/user.service';
import { ApiService } from './../../@core/services/api.service';

@Component({
    templateUrl: './wallet.html',
    styleUrls: ['./wallet.scss']
})

// tslint:disable-next-line:component-class-suffix
export class WalletPage implements OnInit {
    constructor(public userService: UserService) {

	}

    ngOnInit() {}

}

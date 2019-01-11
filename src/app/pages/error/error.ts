import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../@core/services/api.service';
import { UserService } from '../../@core/services/user.service';
import { Location } from '@angular/common';

@Component({
    templateUrl: './error.html',
    styleUrls: ['./error.scss']
})

// tslint:disable-next-line:component-class-suffix
export class ErrorPage implements OnInit {

    message_error = '';

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private router: Router,
        private userService: UserService,
        private location: Location,
    ) { }

    ngOnInit() {
     this.route.params.subscribe(params => {
            if (params.message) {
                this.message_error = params.message;
            } else {
                this.message_error = '';
            }
        });
    }

    async logout() {
        this.userService.isSuperUser = undefined;
        await this.api.logout();
        this.router.navigate(['login']);
    }

    back(){
        this.location.back();
    }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../@core/services/user.service';
import { ApiService } from '../../../@core/services/api.service';

declare var $: any;

@Component({
    selector: 'app-menu-wallet',
    templateUrl: './menu-wallet.html',
    styleUrls: ['./menu-wallet.scss']
})

// tslint:disable-next-line:component-class-suffix
export class MenuWallet implements OnInit {

    constructor(
        public userService: UserService,
        private api: ApiService,
        private router: Router
    ) {
    }

    ngOnInit() {
        $(document).ready(function(){
            $('li[data-toggle="collapse"] .sub-menu li').click(function(e){
                if($(this).closest('li').hasClass('active')){
                    e.stopPropagation();   
                }
            });
        });
    }

    async logout() {
        await this.api.logout();
        this.userService.current_user = null;
        this.router.navigate(['/']);
    }

}

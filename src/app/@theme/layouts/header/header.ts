import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../@core/services/user.service';
import { ApiService } from '../../../@core/services/api.service';
import { MSTransactionService } from './../../../@core/services/ms-transaction.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { TranslateService } from './../../../@core/services/translate.service';
import { PendingTransactionService } from './../../../@core/services/pending-transaction.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss']
})

// tslint:disable-next-line:component-class-suffix
export class Header implements OnInit {

    notifies: any = null;
    language: string = 'en';

    constructor(
        public userService: UserService,
        private api: ApiService,
        private router: Router,
        public mSTransactionService: MSTransactionService,
        private t: TranslatePipe,
        private translateService: TranslateService,
        public pendingTransactionService: PendingTransactionService
    ) {
    }

    ngOnInit() {
        let tokenData = localStorage.getItem(ApiService.USER_TOKEN_KEY);
        if (tokenData) {
            this.getAllPendingTransaction();
        }

        let tokenLang = sessionStorage.getItem(this.translateService.LANGUAGE);
        if(tokenLang){
            this.language = tokenLang;
        }
    }

    async logout() {
        await this.api.logout();
        this.userService.current_user = null;
        this.router.navigate(['/']);
    }

    async getAllPendingTransaction(){
        let options = {
            page: 1, 
            limit: 5
        };
        await this.pendingTransactionService.getMulti(options);
    }

    setLang(lang){
        this.language = lang;
        this.translateService.use(lang);
        sessionStorage.setItem(this.translateService.LANGUAGE, lang);
    }
}

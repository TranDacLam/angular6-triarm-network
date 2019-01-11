import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './@core/services/api.service';
import { UserService } from './@core/services/user.service';
import { TranslateService } from './@core/services/translate.service';
import { SocketService } from './@core/services/socket.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>\n',
})

export class AppComponent {
  constructor(
    private router: Router,
    private apiService: ApiService, 
    private userService: UserService,
    private translateService: TranslateService,
    private socketService: SocketService
  ) {
    this.getIpAddress();
    let tokenData = localStorage.getItem(ApiService.USER_TOKEN_KEY);
    if (tokenData) {
        tokenData = JSON.parse(tokenData);
        this.apiService.userToken = tokenData;
        this.getUserInfo();
    }
    let lang = sessionStorage.getItem(this.translateService.LANGUAGE);
    if(lang){
      this.translateService.use(lang);
    }
  }

  async getUserInfo(){
    let response = await this.userService.getUserInfo();
    if(!response.success){
      swal(
        response.error.errorMessage,
        '',
        'error'
      );
      this.userService.current_user = null;
      this.apiService.logout();
      return this.router.navigate(['/']);
    }
    await this.socketService.initSocket();
    await this.socketService.rootSub();
  }

  async getIpAddress(){
    this.userService.getIpAddress();
  }
}

import {Component, OnInit, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {environment} from './../../../environments/environment';
import * as moment from 'moment';
import { ApiService } from '../../@core/services/api.service';
import { UserService } from '../../@core/services/user.service';
import { IcoService } from '../../@core/services/ico.service';
import { NewsService } from '../../@core/services/news.service';
import { TranslateService } from './../../@core/services/translate.service';
import { SocketService } from './../../@core/services/socket.service';
import swal from 'sweetalert2';

declare var $: any;
declare var FlipClock: any;

@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})

// tslint:disable-next-line:component-class-suffix
export class HomePage implements OnInit, AfterViewInit {

  formLogin: FormGroup;
  ico_info: any = {};
  ico_data: any = {};
  time;
  clock;
  list_lasted_news: Array<any> = [];
  processing = false;
  msg_error = '';

  code_tfa: string = '';
  option_extra: any;
  id_news_detail: number = null;

  TIME_FORMAT = 'DD.MM.YYYY HH:mm Z';

  constructor(
    private api: ApiService,
    private router: Router,
    public userService: UserService,
    private icoService: IcoService,
    private newsService: NewsService,
    private translateService: TranslateService,
    private socketService: SocketService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.getIcoInfo();
    this.getLastedNews();
    this.createForm();
  }

  ngAfterViewInit(){
    $.getScript('./../../../assets/js/home.js', function(){});
  }

  createForm(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async getIcoInfo() {
    const response = await this.icoService.getIcoInfo();
    this.ico_data = response.result;
    this.initIco();
  }

  async getLastedNews() {
    const response = await this.newsService.getLastedNews();
    if(!response.success){
      return;
    }
    this.list_lasted_news = response.result;
    this.list_lasted_news[0].top = '-5px';
    this.list_lasted_news[1].top = '18px';
    this.list_lasted_news[2].top = '40px';
  }

  initIco() {
    if (this.ico_data && this.ico_data.icoStartDate && this.ico_data.icoEndDate) {
      this.ico_info.icoEnabled = this.ico_data.icoEnabled === 'true';
      this.ico_info.icoStartDate = moment(this.ico_data.icoStartDate, this.TIME_FORMAT).toDate();
      this.ico_info.icoEndDate = moment(this.ico_data.icoEndDate, this.TIME_FORMAT).toDate();
      this.calculateTime();

      this.clock = new FlipClock($('#clock'), this.time / 1000, {
        clockFace: 'DailyCounter',
        countdown: true,
        autoPlay: false,
        autoStart: false
      });

      setInterval(() => {
        this.time -= 1000;
        if (this.time < 0) { this.time = 0; }
        this.clock.setTime(this.time / 1000);
        if (this.time <= 0) {
          this.calculateTime();
        }
      }, 1000);
    } else {
      this.ico_info.icoEnabled = false;
    }
  }

  calculateTime() {
    switch (true) {
      case Date.now() < this.ico_info.icoStartDate:
        this.ico_info.icoStatus = 'not-started';
        this.time = this.ico_info.icoStartDate - Date.now();
        break;
      case (Date.now() >= this.ico_info.icoStartDate) && (Date.now() <= this.ico_info.icoEndDate):
        this.ico_info.icoStatus = 'started';
        this.time = this.ico_info.icoEndDate - Date.now();
        break;
      default:
        this.ico_info.icoStatus = 'ended';
    }
  }

  async logout() {
    await this.api.logout();
    this.userService.current_user = null;
    this.router.navigate(['/']);
  }

  async login(){
    this.processing = true;
    let data: any = {};
    data['email'] = this.formLogin.value.email;
    data['password'] = this.formLogin.value.password;
    data['timestamp'] = new Date();
    data['code'] = this.code_tfa;
    data['ip'] = this.userService.ip_address || '';
    let response = await this.api.login(data);
    this.option_extra = response.extra;
    this.processing = false;
    if(!response.success){
        this.formLogin.reset();
        this.code_tfa = '';
        return this.msg_error = response.error.errorMessage;
    }
    this.msg_error = '';
    if (!response.extra.loginTFARequire || (response.extra.loginTFARequire && response.extra.verifyTFA)){
        let response_info_user = await this.userService.getUserInfo();
        if(!response_info_user.success){
          swal(
            response.error.errorMessage,
            '',
            'error'
          );
          this.userService.current_user = null;
          this.api.logout();
          return this.router.navigate(['/']);
      }
      await this.socketService.initSocket();
      await this.socketService.rootSub();
      return this.router.navigate(['/wallet']);
    }else{
      $('#tfaConfirmDialog').modal('show');
    }
  }

  onTfaConfirm(event){
    this.code_tfa = event;
    this.login();
  }

  isIcoEnabled(value) {
    if (value === 'true') {
      return true;
    }
    return false;
  }

  resolved() {
    // console.log(11111)
  }

  setLang(lang){
    this.translateService.use(lang);
    sessionStorage.setItem(this.translateService.LANGUAGE, lang);
  }

}

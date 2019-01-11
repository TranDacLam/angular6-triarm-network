import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiService} from './api.service';
import {LogService} from './log.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isSuperUser: boolean;
  current_user: any = null;
  ip_address: string = '';

  constructor(private apiService: ApiService, private logger: LogService, private http: HttpClient) {
  }

  async getUserInfo() {
    const result = await this.apiService.postJSON({
      name: 'get_user_info',
      params: {}
    });
    if(result.result){
      this.current_user = {...result.result};
      this.isSuperUser = this.current_user.userClass.indexOf(999) >= 0 ? true : false;
    }
    return result;
  }

  async signUp(data) {
    const result = await this.apiService.postJSON({
      name: 'sign_up',
      params: data
    });
    return result;
  }

  async verifyEmail(code_email) {
    const result = await this.apiService.postJSON({
      name: 'verify_email',
      params: {
        code: code_email
      }
    });
    return result;
  }

  async resendVerifyEmail() {
    const result = await this.apiService.postJSON({
      name: 'resend_verify_email',
      params: {}
    });
    return result;
  }

  async forgotPassword(email) {
    const result = await this.apiService.postJSON({
      name: 'forgot_password',
      params: {
        email: email
      }
    });
    return result;
  }

  async resetPassword(data) {
    const result = await this.apiService.postJSON({
      name: 'reset_password',
      params: data
    });
    return result;
  }

  async changePassword(data) {
    const result = await this.apiService.postJSON({
      name: 'change_password',
      params: data
    });
    return result;
  }

  async setGaSecret(password){
    let result = await this.apiService.postJSON({
      name: 'set_ga_secret',
      params: {
        password: password
      }
    });
    return result;
  }

  async verifyGa(data){
    let result = await this.apiService.postJSON({
      name: 'verify_ga',
      params: data
    });
    return result;
  }

  async getLoginHistory(){
    let result = await this.apiService.postJSON({
      name: 'get_login_history',
      params: {}
    });
    return result;
  }

  async requestResetGa(data){
    let result = await this.apiService.postJSON({
      name: 'request_reset_ga',
      params: data
    });
    return result;
  }
  
  async changeLoginTfaRequire(loginTFARequire){
    let result = await this.apiService.postJSON({
      name: 'change_login_tfa_require',
      params: {
        loginTFARequire: loginTFARequire
      }
    });
    return result;
  }
  
  async getListUsersInfo(data_params){
    let result = await this.apiService.postJSON({
      name: 'get_list_users_info',
      params: data_params
    });
    return result;
  }
  
  async getUserInfoByArmId(arm_id){
    let result = await this.apiService.postJSON({
      name: 'get_user_info_by_arm_id',
      params: {
        armId: arm_id
      }
    });
    return result;
  }
  
  async editUserEmail(data_params){
    let result = await this.apiService.postJSON({
      name: 'edit_user_email',
      params: data_params
    });
    return result;
  }
  
  async editUserInfo(data_params){
    let result = await this.apiService.postJSON({
      name: 'edit_user_info',
      params: data_params
    });
    return result;
  }

  async adminChangeStatusUser(data_params){
    let result = await this.apiService.postJSON({
      name: 'admin_change_status_user',
      params: data_params
    });
    return result;
  }

  async adminRequestResetGa(data_params){
    let result = await this.apiService.postJSON({
      name: 'admin_request_reset_ga',
      params: data_params
    });
    return result;
  }
  
  async setPermissionUser(data_params){
    let result = await this.apiService.postJSON({
      name: 'set_permission_user',
      params: data_params
    });
    return result;
  }
  
  async getAllUserSubSystemInfo(data_params){
    let result = await this.apiService.postJSON({
      name: 'get_all_user_subSystem_info',
      params: data_params
    });
    return result;
  }
  
  async resendEmailUserInfo(listUser){
    let result = await this.apiService.postJSON({
      name: 'resend_email_user_info',
      params: {
        listUser: listUser
      }
    });
    return result;
  }
  
  async getAllUserContacts(){
    let result = await this.apiService.postJSON({
      name: 'get_all_user_contacts',
      params: {}
    });
    return result;
  }
  
  async editUserContact(params_user){
    let result = await this.apiService.postJSON({
      name: 'edit_user_contact',
      params: params_user
    });
    return result;
  }

  async createUserContact(params_user){
    let result = await this.apiService.postJSON({
      name: 'create_user_contact',
      params: params_user
    });
    return result;
  }
  
  async removeUserContact(params_user){
    let result = await this.apiService.postJSON({
      name: 'remove_user_contact',
      params: params_user
    });
    return result;
  }

  async getIpAddress(): Promise<any>{
    let ip = await this.http.get('https://jsonip.com').toPromise();
    this.ip_address = ip['ip'] || '';
  }
}

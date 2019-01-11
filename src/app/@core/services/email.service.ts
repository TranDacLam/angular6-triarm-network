import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class EmailService {


  constructor(private apiService: ApiService) {
  }

  async getAdminEmailInboxes() {
    const data = {
      name: 'get_admin_email_inboxes',
      params: {
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async flagEmailThread(data_email) {
    const data = {
      name: 'flag_email_thread',
      params: data_email
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getEmailContent(data_email) {
    const data = {
      name: 'get_email_content',
      params: data_email
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async removeEmailThread(data_email) {
    const data = {
      name: 'remove_email_thread',
      params: data_email
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async getListSubscribers(data_email) {
    const data = {
      name: 'get_list_subscribers',
      params: data_email
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getAdminEmailAddresses() {
    const data = {
      name: 'get_admin_email_addresses',
      params: {}
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async addAdminEmailAddress(emailAddress) {
    const data = {
      name: 'add_admin_email_address',
      params: {
        emailAddress: emailAddress
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async removeAdminEmailAddress(data_email) {
    const data = {
      name: 'remove_admin_email_address',
      params: data_email
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

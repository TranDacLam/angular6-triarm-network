import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class MultiSignService {


  constructor(private apiService: ApiService) {
  }

  async initKeypairForMultiSign(data_multi_sign) {
    const data = {
      name: 'init_keypair_for_multi_sign',
      params: data_multi_sign
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async setupMultiSignWalletForAdmin(data_multi_sign) {
    const data = {
      name: 'setup_multi_sign_wallet_for_admin',
      params: data_multi_sign
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async transferMoneyMultiSignForAdmin(data_multi_sign) {
    const data = {
      name: 'transfer_money_multi_sign_for_admin',
      params: data_multi_sign
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async settingMultiSignWalletForUser(data_multi_sign) {
    const data = {
      name: 'setting_multi_sign_wallet_for_user',
      params: data_multi_sign
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async settingMultiSignWalletForAdmin(data_multi_sign) {
    const data = {
      name: 'setting_multi_sign_wallet_for_admin',
      params: data_multi_sign
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

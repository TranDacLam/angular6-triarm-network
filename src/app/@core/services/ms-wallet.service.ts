import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class MSWalletService {


  constructor(private apiService: ApiService) {
  }

  async getAllMultisignWallet(params_ms_wallet) {
    const data = {
      name: 'get_all_multisign_wallet',
      params: params_ms_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async checkSignerWallet(params_ms_wallet) {
    const data = {
      name: 'check_signer_wallet',
      params: params_ms_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async setupMultiSignWallet(params_ms_wallet) {
    const data = {
      name: 'setup_multi_sign_wallet',
      params: params_ms_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async settingSignerMultiSignWallet(params_ms_wallet) {
    const data = {
      name: 'setting_signer_multi_sign_wallet',
      params: params_ms_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async settingThresholdsMultiSignWallet(params_ms_wallet) {
    const data = {
      name: 'setting_thresholds_multi_sign_wallet',
      params: params_ms_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async setMultiSignWalletProperty(params_ms_wallet) {
    const data = {
      name: 'set_multi_sign_wallet_property',
      params: params_ms_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async disablePaymentOfSharedWallet(params_ms_wallet) {
    const data = {
      name: 'disable_payment_of_shared_wallet',
      params: params_ms_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

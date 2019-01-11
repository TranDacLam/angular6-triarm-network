import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class MultiSignUserService {


  constructor(private apiService: ApiService) {
  }

  async initKeypairForMultiSignUser(data_multi_sign_user) {
    const data = {
      name: 'init_keypair_for_multi_sign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async untrustAssetMultiSignForUser(data_multi_sign_user) {
    const data = {
      name: 'untrust_asset_multi_sign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async createTrustLineMultiSignForUser(data_multi_sign_user) {
    const data = {
      name: 'create_trust_line_multi_sign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async allowTrustMultiSignForUser(data_multi_sign_user) {
    const data = {
      name: 'allow_trust_multi_sign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async setWalletPropertyMultiSignForUser(data_multi_sign_user) {
    const data = {
      name: 'set_wallet_property_multi_sign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async disablePaymentOfWalletMultiSignForUser(data_multi_sign_user) {
    const data = {
      name: 'disable_payment_of_wallet_multi_sign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async issuingAssetMultiSignForUser(data_multi_sign_user) {
    const data = {
      name: 'issuing_asset_multi_sign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async convertAssetMultiSignForUser(data_multi_sign_user) {
    const data = {
      name: 'convert_asset_multisign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async transferMoneyMultiSignForUser(data_multi_sign_user) {
    const data = {
      name: 'transfer_money_multi_sign_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async setupMultiSignWalletForUser(data_multi_sign_user) {
    const data = {
      name: 'setup_multi_sign_wallet_for_user',
      params: data_multi_sign_user
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

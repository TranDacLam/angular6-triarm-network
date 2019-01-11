import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class WalletService {


  constructor(private apiService: ApiService) {
  }

  async getAllUserWallets(data_wallet) {
    const data = {
      name: 'get_all_user_wallets',
      params: data_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async getUserWallet(data_wallet) {
    const data = {
      name: 'get_user_wallet',
      params: data_wallet
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getTotalCoin() {
    const data = {
      name: 'get_total_coin',
      params: {}
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getAllFirstWalletNonUser() {
    const data = {
      name: 'get_all_first_wallet_non_user',
      params: {}
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async createFirstWalletNonUser(data_params) {
    const data = {
      name: 'create_first_wallet_non_user',
      params: data_params
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async getWalletsInfoByArmId(arm_id, only_admin_asset){
    let result = await this.apiService.postJSON({
      name: 'get_wallets_info_by_arm_id',
      params: {
        armId: arm_id,
        onlyAdminAsset: only_admin_asset
      }
    });
    return result;
  }
  
  async adminUnblockWallet(listWalletAddress){
    let result = await this.apiService.postJSON({
      name: 'admin_unblock_wallet',
      params: {
        listWalletAddress: listWalletAddress
      }
    });
    return result;
  }
  
  async renameWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'rename_wallet',
      params: data_wallet
    });
    return result;
  }
  
  async restoreWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'restore_wallet',
      params: data_wallet
    });
    return result;
  }
  
  async getPaymentsOfWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'get_payments_of_wallet',
      params: data_wallet
    });
    return result;
  }
  
  async activeWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'active_wallet',
      params: data_wallet
    });
    return result;
  }
  
  async mergeWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'merge_wallet',
      params: data_wallet
    });
    return result;
  }
  
  async getKeypair(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'get_keypair',
      params: data_wallet
    });
    return result;
  }
  
  async saveWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'save_wallet',
      params: data_wallet
    });
    return result;
  }
  
  async createWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'create_wallet',
      params: data_wallet
    });
    return result;
  }
  
  async setWalletProperty(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'set_wallet_property',
      params: data_wallet
    });
    return result;
  }
  
  async disablePaymentOfWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'disable_payment_of_wallet',
      params: data_wallet
    });
    return result;
  }
  
  async unblockWallet(data_wallet){
    let result = await this.apiService.postJSON({
      name: 'unblock_wallet',
      params: data_wallet
    });
    return result;
  }
}

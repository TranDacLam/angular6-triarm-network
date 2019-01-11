import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class AssetService {


  constructor(private apiService: ApiService) {
  }

  async getAsset(params_asset) {
    const data = {
      name: 'get_asset',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getAllAssets() {
    const data = {
      name: 'get_all_assets',
      params: {}
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getAllUserAssets(params_asset) {
    const data = {
      name: 'get_all_user_assets',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async updateAssetLogo(params_asset) {
    const data = {
      name: 'update_asset_logo',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async createNewAsset(params_asset) {
    const data = {
      name: 'create_new_asset',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async changeHoldingFeeWallet(params_asset) {
    const data = {
      name: 'change_holding_fee_wallet',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async issuingAsset(params_asset) {
    const data = {
      name: 'issuing_asset',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  x
  async createTrustLine(params_asset) {
    const data = {
      name: 'create_trust_line',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async unTrustAsset(params_asset) {
    const data = {
      name: 'un_trust_asset',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async allowTrustAsset(params_asset) {
    const data = {
      name: 'allow_trust_asset',
      params: params_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class MSAssetService {


  constructor(private apiService: ApiService) {
  }

  async createTrustLineMultiSign(params_ms_asset) {
    const data = {
      name: 'create_trust_line_multi_sign',
      params: params_ms_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getUserMultisignAsset(params_ms_asset) {
    const data = {
      name: 'get_user_multisign_asset',
      params: params_ms_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async createAssetMultisign(params_ms_asset) {
    const data = {
      name: 'create_asset_multisign',
      params: params_ms_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async changeHoldingFeeWalletMultisign(params_ms_asset) {
    const data = {
      name: 'change_holding_fee_wallet_multisign',
      params: params_ms_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async issuingAssetMultisign(params_ms_asset) {
    const data = {
      name: 'issuing_asset_multisign',
      params: params_ms_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async convertingAssetMultisign(params_ms_asset) {
    const data = {
      name: 'converting_asset_multisign',
      params: params_ms_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async untrustMultiSign(params_ms_asset) {
    const data = {
      name: 'untrust_multi_sign',
      params: params_ms_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async allowTrustMultisign(params_ms_asset) {
    const data = {
      name: 'allow_trust_multisign',
      params: params_ms_asset
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

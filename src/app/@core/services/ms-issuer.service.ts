import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class MSIssuerService {


  constructor(private apiService: ApiService) {
  }

  async getIssuingHistoryMultiSign(params_ms_issuer) {
    const data = {
      name: 'get_issuing_history_multi_sign',
      params: params_ms_issuer
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getTrustAssetRequestMultisign(params_ms_issuer) {
    const data = {
      name: 'get_trust_asset_request_multisign',
      params: params_ms_issuer
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

}

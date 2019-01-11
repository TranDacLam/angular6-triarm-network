import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
    providedIn: 'root'
})
export class IssuerService {


    constructor(private apiService: ApiService) {
    }

    async getIssuerInfo(params_issuer) {
        const data = {
          name: 'get_issuer_info',
          params: params_issuer
        };
        const result = await this.apiService.postJSON(data);
        return result;
    }

    async getIssuerRequestHistory(id) {
        let params = {
          issuerID: id
        }
        const data = {
          name: 'get_issuer_request_history',
          params: params
        };
        const result = await this.apiService.postJSON(data);
        return result;
    }

    async becomeIssuer(data_issyer) {
        const data = {
          name: 'become_issuer',
          params: data_issyer
        };
        const result = await this.apiService.postJSON(data);
        return result;
    }

    async getIssuerInfoByArmId(arm_id){
      const data = {
        name: 'get_issuer_info',
        params: {
          armId: arm_id
        }
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async setStatusPersonalInfoIssuer(data_params){
      const data = {
        name: 'set_status_personal_info_issuer',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async getAllIssuers(){
      const data = {
        name: 'get_all_issuers',
        params: {}
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async changeActiveIssuer(data_params){
      const data = {
        name: 'change_active_issuer',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async rejectIssuer(data_params){
      const data = {
        name: 'reject_issuer',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async approveIssuer(data_params){
      const data = {
        name: 'approve_issuer',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async getIssuingHistory(data_params){
      const data = {
        name: 'get_issuing_history',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async convertAssetBack(data_params){
      const data = {
        name: 'convert_asset_back',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async changeStatusPersonalInfoIssuer(data_params){
      const data = {
        name: 'change_status_personal_info_issuer',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
    
    async getTrustAssetRequest(data_params){
      const data = {
        name: 'get_trust_asset_request',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
}

import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class MSTransactionService {


  constructor(private apiService: ApiService) {
  }

  async getAllPendingTransaction(params_ms_transaction) {
    const data = {
      name: 'get_all_pending_transaction',
      params: params_ms_transaction
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getDetailMultisignTransaction(params_ms_transaction) {
    const data = {
      name: 'get_detail_multisign_transaction',
      params: params_ms_transaction
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async signAndSubmitTransaction(params_ms_transaction) {
    const data = {
      name: 'sign_and_submit_transaction',
      params: params_ms_transaction
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async transferMoneyMultiSign(params_ms_transaction) {
    const data = {
      name: 'transfer_money_multi_sign',
      params: params_ms_transaction
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

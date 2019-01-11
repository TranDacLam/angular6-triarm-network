import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {


  constructor(private apiService: ApiService) {
  }

  async transactionFee() {
    const data = {
      name: 'transaction_fee',
      params: {}
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async generateRequestMoneyQrcode(params_transaction) {
    const data = {
      name: 'generate_request_money_qrcode',
      params: params_transaction
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getTransactionsHistory(params_transaction) {
    const data = {
      name: 'get_transactions_history',
      params: params_transaction
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async transferMoney(params_transaction) {
    const data = {
      name: 'transfer_money',
      params: params_transaction
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

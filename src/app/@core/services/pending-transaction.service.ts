import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import { MSTransactionService } from './ms-transaction.service'; 
import { TranslatePipe } from './../../@theme/pipes/translate.pipe';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PendingTransactionService {

  notifies: any = null;

  constructor(
    private apiService: ApiService,
    private mSTransactionService: MSTransactionService,
    private t: TranslatePipe
  ) {}

  async getMulti(opts){
    let response = await this.mSTransactionService.getAllPendingTransaction(opts);
    if (response.success) {
      this.notifies = {
        data: response.result.allPendingTXs,
        amount: response.result.totalRecord
      };
    }
    else {
      swal(
        response.error.errorMessage,
        '',
        'error'
      );
    }
  }

  getTypeTransaction(pendingTransaction) {
    switch (pendingTransaction.type) {
      case 1:
        return this.t.transform('change_threshold');
      case 2:
        return this.t.transform('change_signer');
      case 3:
        return this.t.transform('change_master_weight');
      case 4:
        return this.t.transform('set_property');
      case 5:
        return this.t.transform('issuing_asset');
      case 6:
        return this.t.transform('allow_trust');
      case 7:
        return this.t.transform('trust_asset');
      case 8:
        return this.t.transform('untrust_asset');
      case 9:
        return this.t.transform('payment');
      case 10:
        return this.t.transform('create_account');
      case 11:
        return this.t.transform('limit_issuing');
      default:
        return "";
    }
  }
}

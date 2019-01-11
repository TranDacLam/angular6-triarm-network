import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
    providedIn: 'root'
})
export class MerchantService {


    constructor(private apiService: ApiService) {
    }

    async getMerchantInfo() {
        const data = {
          name: 'get_merchant_info',
          params: {}
        };
        const result = await this.apiService.postJSON(data);
        return result;
    }
}

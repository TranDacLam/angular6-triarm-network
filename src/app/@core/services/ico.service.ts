import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class IcoService {


  constructor(private apiService: ApiService) {
  }

  async getIcoInfo() {
    const data = {
      name: 'get_ico_info',
      params: {
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getAllIcoPackets() {
    const data = {
      name: 'get_all_ico_packets',
      params: {
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async changeIcoMakerAuth(data_params){
      const data = {
        name: 'change_ico_maker_auth',
        params: data_params
      };
      const result = await this.apiService.postJSON(data);
      return result;
    }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {JSONResponse} from '../types/json-response';
import {LogService} from './log.service';
import {ErrorHandler} from '../common/handle-error';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  static USER_TOKEN_KEY = 'USER_TOKEN';
  userToken: any = '';

  constructor(private http: HttpClient,
              private logger: LogService,
              private errorHandler: ErrorHandler,
  ) {
  }

  public async loadToken() {
    let tokenData = localStorage.getItem(ApiService.USER_TOKEN_KEY);
    if (tokenData) {
      tokenData = JSON.parse(tokenData);
      this.userToken = tokenData;
    } else {
      this.userToken = '';
    }
  }

  private async postRequest({data, options, noRetry}): Promise<JSONResponse> {
    this.logger.log(data, options, noRetry);
    return new Promise<JSONResponse>((resolve) => {
      const newHeaders = options.headers;
      // if (this.userToken) {
      //   newHeaders = newHeaders.append('Authorization', this.userToken);
      // }
      this.http.post<any>(environment.API_SERVER + '/'+ environment.API_SERVER_VERSION +'/rpc', data, Object.assign({}, options, {
        headers: newHeaders,
        responseType: 'json'
      })).subscribe(
        async (response) => {
          this.logger.log(response);
          if (!response['success']) {
            // if (!!this.userToken && [3].indexOf(response['error']['errorCode']) >= 0) {
            //   return this.errorHandler.handle_error(response['error']);
            // }
            if (!!this.userToken && [12, 116].indexOf(response['error']['errorCode']) >= 0) {
              this.logout();
              return this.errorHandler.handle_error(response['error']);
            }
          }
          console.log('response', response)

          let data_result = response['result'] ? response['result'] : response['data'];
          if(typeof(response['result']) == 'boolean'){
            data_result = response['result'];
          }
          
          return resolve(new JSONResponse({
            extra: response['extra'] ? response['extra'] : null,
            firstWallet: response['firstWallet'],
            issuerLatestRequest: response['issuerLatestRequest'] ? response['issuerLatestRequest'] : null,
            success: response['success'],
            result: data_result,
            error: response['error'],
            totalUser: response['totalUser'] ? response['totalUser'] : null,
            assetCode: response['assetCode'] ? response['assetCode'] : '',
            qrData: response['qrData'] ? response['qrData'] : ''
          }));
        },
        async (err) => {
          this.logger.log('err', err);
          return resolve(new JSONResponse({
            success: false,
            error: {errorCode: null, errorMessage: 'NETWORK_ERROR'}
          }));
        });
    });
  }

  async postJSON(data): Promise<JSONResponse> {
    if (this.userToken) {
      data.token = this.userToken;
    }
    return this.postRequest({
      data,
      options: {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      },
      noRetry: false
    });
  }


  async login(data_login): Promise<JSONResponse> {
    const data = {
      name: 'sign_in',
      params: data_login
    };
    const response = await this.postJSON(data);
    if (response.success) {
      // -- save user
      this.userToken = response.result['access_token'];
      if(!response.extra.loginTFARequire || (response.extra.loginTFARequire && response.extra.verifyTFA)){
        localStorage.setItem(ApiService.USER_TOKEN_KEY, JSON.stringify(this.userToken));
      }
    }
    return response;
  }

  async logout(): Promise<any> {
    this.userToken = null;
    localStorage.removeItem(ApiService.USER_TOKEN_KEY);
  }
}

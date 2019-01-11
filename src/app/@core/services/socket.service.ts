import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import { JSONResponse } from '../types/json-response';
import { ApiService } from './api.service';
import * as socketIo from 'socket.io-client';
import * as sailsIo from 'sails.io.js';
import { UserService } from './user.service';
import { PendingTransactionService } from './pending-transaction.service'; 
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from './../../@theme/pipes/translate.pipe';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  // Our socket connection
  private socket;
  thresholds: any = null;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private userService: UserService,
    private pendingTransactionService: PendingTransactionService,
    private toastr: ToastrService,
    private t: TranslatePipe
  ) {
  }

  initSocket(): void {
    let io;
    if (socketIo['sails']) {
      io = socketIo;
    } else {
      io = sailsIo(socketIo);
    }
    io.sails.autoConnect = false;
    io.sails.url = environment.API_SERVER;
    this.socket = io.sails.connect();
    this.socket.on('connect', () => {
    let dataJoin = {
      name: 'multi_subscribe',
      params: {
        roomName: [
          'WALLET.CREATE.' + this.userService.current_user._id,
          'WALLET.TRUST_ASSET.' + this.userService.current_user._id,
          'WALLET.MERGE.' + this.userService.current_user._id,
          'PAYMENT.REGULAR_PAYMENT.' + this.userService.current_user._id,
          'PAYMENT.PATH_PAYMENT.' + this.userService.current_user._id,
          'OFFER.' + this.userService.current_user._id,
          'TRANSACTION' + '.' + this.userService.current_user._id,
          'PENDING_TRANSACTION.' + this.userService.current_user._id,
        ]
      }
    };
    
    // if ($rootScope.global.pendingTX) dataJoin.params.roomName.push('PENDING_TRANSACTION_DETAIL.' + his.userService.current_user._id + '.' + $rootScope.global.pendingTX._id,)

    this.socket.post(environment.API_SERVER + '/socket', dataJoin, (res) => {
        if (!res.success) {
          console.log("error socket", res);
        }else{
          console.log("success socket", res);
        }
      });
    });
    
  }

  rootSub(){
    this.socket.on('notification', (message) => {
      switch (message.type_i) {
        case 9: {
          const options = {page: 1, limit: 5};
          if (message.pendingTransaction.status == 0) {
            if (message.subType == 0) {
              this.pendingTransactionService.getMulti(options);
              let mess = `${this.t.transform('you_have_new_pending_transaction')} <a class="toastr-info" href="/wallet/advance-transaction/"${message.pendingTransaction._id}">GO</a>.`;
              this.toastr.info(mess, this.t.transform('info_'), {enableHtml: true, closeButton: true});
            }
          }
          else { // transaction fail or success remove notify
            this.pendingTransactionService.getMulti(options);
          }
          break;
        }
      }
    });
  }

  onSocketNotification(): Observable<any>{
    return new Observable<any>(observer => {
       this.socket.on('notification', (message: any) => observer.next(message));
    });
  }

  pendingDetailSubmitPub(pendingTranID, walletID) {
    this.http.post(environment.API_SERVER + '/socket', {name: "pending_detail_submit_pub", params: {pendingTranID, walletID}})
      .subscribe(function (response) {
        console.log(response);
      }, function (err) {
        console.log(err);
      }
    );
  }

  pendingDetailCancelSubmitPub(pendingTranID, walletID) {
      this.http.post(environment.API_SERVER + '/socket', {name: "pending_detail_cancel_submit_pub", params: {pendingTranID, walletID}})
        .subscribe(function (response) {
          console.log(response);
        }, function (err) {
          console.log(err);
        });
    }

}

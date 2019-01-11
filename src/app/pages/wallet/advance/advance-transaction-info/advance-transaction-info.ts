import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MSTransactionService } from './../../../../@core/services/ms-transaction.service';
import { Helper } from './../../../../@core/common/helper';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import { errors } from './../../../../@core/common/error-code';
import { SocketService } from './../../../../@core/services/socket.service';
import * as moment from 'moment';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './advance-transaction-info.html',
    styleUrls: ['./advance-transaction-info.scss']
})

export class AdvanceTransactionInfoComponent implements OnInit {

    infoTransaction = null;
    signatures = [];
    availableSigner = null;
    waitResponse = false;
    canSignAndSubmit: boolean = false;
    options_choose_signer: any = null;
    selectedSigner: any = null;
    isSubmited: boolean = false;
    htmlPopover: any = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private t: TranslatePipe,
    	private mSTransactionService: MSTransactionService,
        private socketService: SocketService,
    	private helper: Helper
    ) {}

    ngOnInit() {
    	let id = this.route.snapshot.paramMap.get('id');
        this.getDetailMultisignTransaction(id);
    }

    async getDetailMultisignTransaction(id){
        let data = {
            txID: id
        }
        this.waitResponse = true;
        let response = await this.mSTransactionService.getDetailMultisignTransaction(data);
        this.waitResponse = false;
        if(!response.success){
            return;
        }
        if(response.result){
            this.infoTransaction = {
                _id: response.result._id,
                status: response.result.status,
                wallet: response.result.walletID,
                createdOn: moment(response.result.createdAt).format('YYYY/MM/DD HH:mm:ss Z'),
                user: {
                  name: response.result.signedBy[0].signer.name,
                  address: response.result.signedBy[0].signer.address,
                },
                signedAmount: response.result.signedBy.length,
                totalSigners: response.result.walletID.signers.length,
                weightRequire: response.result.weightRequire,
                transaction: response.result.transaction,
            };
            this.infoTransaction['totalSignedWeight'] = this.sumBy(response.result.signedBy);
            this.infoTransaction['totalSignedPercent'] = this.infoTransaction.totalSignedWeight / response.result.weightRequire * 100;
            this.signatures = response.result.walletID.signers.map((s) => {
                const {totalSignedWeight, weightRequire} = this.infoTransaction;
                const percent = (s.weight + totalSignedWeight <= weightRequire ? s.weight : weightRequire - totalSignedWeight) / weightRequire * 100;
                return {
                  name: s.name,
                  address: s.public_key,
                  isMasterKey: s.public_key === response.result.walletID.address,
                  weight: s.weight,
                  isOwned: s.isOwned,
                  isSigned: response.result.signedBy.some((s2) => s2.signer.address === s.public_key),
                  percent,
                };
            });
            this.availableSigner = this.signatures.find(signer => signer.isOwned && !signer.isSigned);
            this.canSignAndSubmit = this.availableSigner ? this.availableSigner.weight > 0 : false;

            // SOCKET
            this.socketService.onSocketNotification().subscribe(
                (message: any) => {
                    this.isSubmited = false;
                    this.htmlPopover = null;
                    if (message.subType == 2) {
                      this.waitResponse = true;
                    }
                    else if (message.subType == -2) {
                      this.waitResponse = false;
                    }

                    if (message.pendingTransaction.submiter) {
                      this.isSubmited = true;
                      this.infoTransaction.status = message.pendingTransaction.status;
                      const {avatar, firstname, middlename, lastname} = message.pendingTransaction.submiter;
                      this.htmlPopover = `<span><img style="width:10%; margin-left: 30px;" src="${avatar}"/></span> <small>${firstname} ${middlename ? middlename : ''} ${lastname}</small>`;
                    }
                }
            );
        }
    }

    viewerSubmitAction(pendingTranID, walletID){
        this.socketService.pendingDetailSubmitPub(pendingTranID, walletID);
    }

    sumBy(arr){
        let total = 0;
        arr.forEach(item => {
            total += item.weight;
        });
        return total;
    }

    signAndSubmit(){
        const signers = this.infoTransaction.wallet.signers.filter(signer => !!this.signatures.find(signature => signature.address === signer.public_key && signature.isOwned && !signature.isSigned));
        this.options_choose_signer = {signers};
        $('#chooseSignerDialog').modal('show');
    }

    onChooseSignerDialog(event){
        this.selectedSigner = event;
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        this.waitResponse = true;
        let data = {
            code: event,
            pendingTransactionID: this.infoTransaction._id,
            signerAddress: this.selectedSigner.public_key,
            sourceAddress: this.infoTransaction.wallet.address,
        }
        let response = await this.mSTransactionService.signAndSubmitTransaction(data);
        this.waitResponse = false;
        this.socketService.pendingDetailCancelSubmitPub(this.infoTransaction._id, this.infoTransaction.wallet._id);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return this.router.navigate(['/wallet/advance-transaction/', this.infoTransaction._id ]);
        }
        if (response.result.status == 1) {
            swal(
                this.t.transform('submitted_transaction_successfully'),
                '',
                'success'
            );
            this.router.navigate(['/wallet/advance-wallet']);
        }
        else if (response.result.status == 2) {
            swal(
                this.t.transform('transaction_submit_fail'),
                '',
                'error'
            );
            this.router.navigate(['/wallet/advance-transaction']);
        }
        else {
            this.router.navigate(['/wallet/advance-transaction/', response.result._id ]);
        }

    }

}

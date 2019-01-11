import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MSIssuerService } from './../../../../@core/services/ms-issuer.service';
import { MSAssetService } from './../../../../@core/services/ms-asset.service';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import { errors } from './../../../../@core/common/error-code';
import { Helper } from './../../../../@core/common/helper';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
    templateUrl: './advance-asset-permission.html',
    styleUrls: ['./advance-asset-permission.scss']
})

export class AdvanceAssetPermissionWalletComponent implements OnInit {

    showingFilter = [];
    select_filter = [];
    trust_filter = [1, 2, 3, 4];
    trustRequests = [];
    asset: any = null;
    signers: any = null;
    availableSigner: any = null;
    haveRequestSelected: boolean = false;
    assetCode = '';
    waitingChange = false;
    waitingResponse = false;
    dataAllowTrust: any = null;
    select_settings: any = null;
    options_choose_signer: any = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private mSIssuerService: MSIssuerService,
        private mSAssetService: MSAssetService,
        public helper: Helper,
        private t: TranslatePipe,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            let assetId = params.assetId ? params.assetId : '';
            let issuerId = params.issuerId ? params.issuerId : '';
            this.getTrustAssetRequestMultisign(assetId, issuerId);
        });
        this.select_settings = {
            singleSelection: false, 
            text: this.t.transform('select_email'),
            selectAllText: this.t.transform('select_all'),
            unSelectAllText:this.t.transform('unSelect_all'),
            enableSearchFilter: true,
            classes:"valign-center filter-email",
            labelKey: 'name'
        };
        this.showingFilter = [
            {id: 1, name: this.t.transform('pending_')},
            {id: 2, name: this.t.transform('rejected_')},
            {id: 3, name: this.t.transform('accepted_')},
            {id: 4, name: this.t.transform('canceled_')},
        ];
        this.select_filter = [...this.showingFilter];
    }

    async getTrustAssetRequestMultisign(assetId, issuerId){
        let data = {
            assetId: assetId,
            issuerId: issuerId
        }
        let response = await this.mSIssuerService.getTrustAssetRequestMultisign(data);
        if(!response.success){
            this.waitingResponse = false;
            swal(
                response.extra ? response.extra : this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        const {requests, asset, signers} = response.result;
        this.asset = asset;
        this.trustRequests = requests;
        this.signers = signers;
        this.availableSigner = signers.find(signer => signer.isOwned && signer.weight > 0);
    }

    checkChange(id) {
        this.waitingChange = true;
        this.trustRequests.forEach((request) => {
            if (request._id === id) {
                if (request.checked)
                    request.checked = true;
                else
                    request.checked = false;
            }
        });
        this.haveRequestSelected = !!this.trustRequests.find(request => request.status === 1 && request.checked);
        this.waitingChange = false;
    }

    checkAll() {
        this.trustRequests.forEach((request) => {
            if (request.status === 1) {
                request.checked = true;
            }
        });
    }

    allowTrust(id, authorize){
        this.dataAllowTrust = {
            id: id,
            authorize: authorize
        }
        this.options_choose_signer = {signers: this.signers};
        $('#chooseSignerDialog').modal('show');
    }

    async onChooseSignerDialog(event){
        this.waitingResponse = true;
        let listPendingID = [];
        if (this.dataAllowTrust.id === 'all') {
            this.trustRequests.forEach((request) => {
                if (request.status === 1 && request.checked) {
                    listPendingID.push(request._id);
                }
            });
        } else {
            listPendingID.push(this.dataAllowTrust.id);
        }
        let data = {
            walletAddress: this.asset.walletID.address,
            sourceAddress: event.public_key,
            listPendingRequest: listPendingID,
            authorize: this.dataAllowTrust.authorize,
            assetCode: this.asset.name
        }
        let response = await this.mSAssetService.allowTrustMultisign(data);
        if(!response.success){
            this.waitingResponse = false;
            swal(
                response.extra ? response.extra : this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        if (response.result.status == 1) {
            this.toastr.success(this.t.transform('allow_trust_successfully'));
            this.trustRequests.forEach((request, index) => {
                listPendingID.forEach((id) => {
                    if (id === request._id) {
                        this.trustRequests[index].status = this.dataAllowTrust.authorize === true ? 3 : 2;
                    }
                });
            });
        }else if (response.result.status == 2) {
            swal(
                this.t.transform('transaction_submit_fail'),
                '',
                'error'
            );
            this.router.navigate(['/wallet/advance-transaction']);
        }
        else {
            this.router.navigate(['/wallet/advance-transaction', response.result._id]);
        }
    }

    onSelectFilterStatus(event){
        this.trust_filter.push(event.id);
    }

    onDeSelectFilterStatus(event){
        let index = this.trust_filter.findIndex((item) => {
            return item == event.id;
        })
        this.trust_filter.splice(index, 1);
    }

    onSelectAllFilterStatus(){
        this.trust_filter = [1, 2, 3, 4];
    }

    onDeSelectAllFilterStatus(){
        this.trust_filter = [];
    }
}

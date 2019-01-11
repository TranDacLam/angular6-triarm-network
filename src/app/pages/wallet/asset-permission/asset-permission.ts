import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IssuerService } from './../../../@core/services/issuer.service';
import { AssetService } from './../../../@core/services/asset.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import { Helper } from './../../../@core/common/helper';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './asset-permission.html',
    styleUrls: ['./asset-permission.scss']
})

export class AssetPermissionWalletComponent implements OnInit {

    showingFilter = [];
    select_filter = [];
    trust_filter = [1, 2, 3, 4];
    trustRequests = [];
    assetCode = '';
    waitingChange = false;
    waitingResponse = false;
    select_settings: any = null;

    constructor(
        private route: ActivatedRoute,
        private issuerService: IssuerService,
        private assetService: AssetService,
        public helper: Helper,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            let id = params.assetId ? params.assetId : '';
            this.getTrustAssetRequest(id);
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

    async getTrustAssetRequest(id){
        let data = {
            assetId: id
        }
        let response = await this.issuerService.getTrustAssetRequest(data);
        if(!response.success){
            this.waitingResponse = false;
            swal(
                response.extra ? response.extra : this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.assetCode = response.assetCode;
        this.trustRequests = response.result;
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
        this.waitingChange = false;
    }

    checkAll() {
        this.trustRequests.forEach((request) => {
            if (request.status === 1) {
                request.checked = true;
            }
        });
    }

    async allowTrust(id, authorize){
        this.waitingResponse = true;
        let listPendingID = [];
        if (id === 'all') {
            this.trustRequests.forEach((request) => {
                if (request.status === 1 && request.checked) {
                    listPendingID.push(request._id);
                }
            });
        } else {
            listPendingID.push(id);
        }
        let data = {
            listPendingRequest: listPendingID,
            authorize: authorize,
            assetCode: this.assetCode,
        }
        let response = await this.assetService.allowTrustAsset(data);
        if(!response.success){
            this.waitingResponse = false;
            swal(
                response.extra ? response.extra : this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.trustRequests.forEach((request, index) => {
            listPendingID.forEach((id) => {
                if (id === request._id) {
                    this.trustRequests[index].status = authorize === true ? 3 : 2;
                }
            });
        });
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

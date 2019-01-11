import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssuerService } from './../../../../@core/services/issuer.service';
import { TranslatePipe } from './../../../../@theme/pipes/translate.pipe';
import { errors } from './../../../../@core/common/error-code';
import { Helper } from './../../../../@core/common/helper';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './issuer.html',
    styleUrls: ['./issuer.scss']
})

export class IssuerComponent implements OnInit {

    limit: number = 10;
    currentPage: number = 1;
    currentItems: Array<any> = [];
    list_all_issuer: Array<any> = [];
	issuers: Array<any> = [];
	showingFilter: Array<number> = [1, 2, 3];
	select_settings: any;
	status_selected: Array<any> = [];
	issuer_selected: Array<any> = [];
    waitTableData: boolean = false;

	issuer_detail_id: any;
    issuer_deny: any;

    constructor(
        private router: Router,
    	private issuerService: IssuerService,
    	private t: TranslatePipe,
    	public helper: Helper
    ) {}

    ngOnInit() {
    	this.getAllIssuers();

    	this.select_settings = {
    		singleSelection: false, 
            text:"Select Email",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            classes:"valign-center filter-email",
            labelKey: 'status'
    	};
    	this.status_selected = [
			{
				id: 1, status: this.t.transform('pending_')
			},
			{
				id: 2, status: this.t.transform('rejected_')
			},
			{
				id: 3, status: this.t.transform('accepted_')
			}
		];
		this.issuer_selected = [...this.status_selected];
    }

    async getAllIssuers(){
        this.waitTableData = true;
    	let response = await this.issuerService.getAllIssuers();
        this.waitTableData = false;
    	if(!response.success){
    		return;
    	}
    	this.list_all_issuer = response.result;
        this.issuerLatestRequest();
    }

    issuerLatestRequest(){
        this.issuers = [];
        this.list_all_issuer.map((item) => {
            if(item.latestRequest && this.showingFilter.indexOf(item.latestRequest.status) >= 0){
                this.issuers.push(item);
            }
        });
        this.currentItems = this.issuers.slice(0, this.limit);
    }

    showRequestHistory(id){
    	this.issuer_detail_id = id;
    	$('#issuerRequestHistoryDialog').modal('show');
    }

    async makeIssuerActiveToggle(issuer){
    	let data = {
    		issuerId: issuer._id,
            active: !issuer.active
    	}
    	let response = await this.issuerService.changeActiveIssuer(data);
    	if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
    		return;
    	}
    	issuer.active = !issuer.active;
    }

    denyIssuer(issuer) {
        this.issuer_deny = issuer;
        $('#inputDialog').modal('show');
    };

    async inputDialog(event){
        let data = {
            issuerID: this.issuer_deny._id,
            extra: event,
            latestRequest: this.issuer_deny.latestRequest._id
        }
        let response = await this.issuerService.rejectIssuer(data);
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        let updateIndex = this.issuers.findIndex((item) => {
            return (item._id === this.issuer_deny._id);
        });
        this.issuers[updateIndex].latestRequest.status = 2;
    }

    async approveIssuer(issuer) {
        swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('do_you_want_approve_this_issuer'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('ok_'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                let data_params = {
                    issuerID: issuer._id,
                    latestRequest: issuer.latestRequest._id
                }
                this.issuerService.approveIssuer(data_params).then(
                    (data) => {
                        if(!data.success){
                            swal(
                                this.t.transform(errors[data.error.errorCode]),
                                '',
                                'error'
                            );
                            return;
                        }
                        let updateIndex = this.issuers.findIndex((item) => {
                            return item._id === issuer._id;
                        });
                        this.issuers[updateIndex].latestRequest.status = 3;
                        this.issuers[updateIndex].lastRequest = this.issuers[updateIndex].latestRequest;
                    }
                )
            }
        });
    };

    pageChanged(event){
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.currentPage = event.page;
        this.currentItems = this.issuers.slice(startItem, endItem);
    }

    onSelectFilterStatus(event){
        this.showingFilter.push(event.id);
        this.issuerLatestRequest();
    }

    onDeSelectFilterStatus(event){
        let index = this.showingFilter.findIndex((item) => {
            return item == event.id;
        })
        this.showingFilter.splice(index, 1);
        this.issuerLatestRequest();
    }

    onSelectAllFilterStatus(){
        this.showingFilter = [1, 2, 3];
        this.issuerLatestRequest();
    }

    onDeSelectAllFilterStatus(){
        this.showingFilter = [];
        this.issuerLatestRequest();
    }
}

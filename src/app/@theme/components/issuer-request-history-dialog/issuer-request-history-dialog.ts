import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IssuerService } from './../../../@core/services/issuer.service';
import { Helper } from './../../../@core/common/helper';

@Component({
    selector: 'app-issuer-request-history-dialog',
    templateUrl: './issuer-request-history-dialog.html',
    styleUrls: ['./issuer-request-history-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class IssuerRequestHistoryDialog implements OnInit, OnChanges {

	@Input() issuer_id: string;

	loadingInfo: boolean = true;
	histories: Array<any> = [];
	currentRequestIndex: number = 0;

    constructor(
    	private issuerService: IssuerService,
    	public helper: Helper,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(){
        if(this.issuer_id){
            this.getIssuerRequestHistory();
        }
    }

    async getIssuerRequestHistory(){
    	this.loadingInfo = false;
    	let response = await this.issuerService.getIssuerRequestHistory(this.issuer_id);
    	this.loadingInfo = true;
    	if(!response.success){
    		return;
    	}
    	this.histories = response.result;
    	if (this.histories.length){
			this.currentRequestIndex = 1;
		}
 
    }

    prevPaginator(){
    	this.currentRequestIndex -= 1;
    }

    nextPaginator(){
    	this.currentRequestIndex += 1;
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IcoService } from './../../../@core/services/ico.service';
import { AssetService } from './../../../@core/services/asset.service';
import { WalletService } from './../../../@core/services/wallet.service';
import { SystemService } from './../../../@core/services/system.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import { BigNumber } from 'bignumber.js';
import swal from 'sweetalert2';

@Component({
    templateUrl: './summary.html',
    styleUrls: ['./summary.scss']
})

export class SummaryComponent implements OnInit {

	ico_packets: Array<any> = [];
	all_user_wallets: Array<any> = [];
	isMaintenance: boolean;
	asset: any = {};
	total: number = 0;
	sold: number = 0;
	pending: number = 0;
	other: number = 0;
	available: number = 0;
	percentage: any = {};
	GBTtotal: number = 0;
	GBTavailable: number = 0;
	GBTpercentage: any = {};
	GBTother: number = 0;

    constructor(
    	private icoService: IcoService,
    	private assetService: AssetService,
    	private walletService: WalletService,
    	private systemService: SystemService,
    	private router: Router,
        private t: TranslatePipe
    ) {}

    ngOnInit() {
    	this.getTotalCoin();
    	this.initSummary();
    }

    async initSummary(){
    	await this.getAllIcoPackets();
    	await this.getAllUserWallets();
    	await this.checkMaintenanceStatus();
    	await this.getAsset();
    	this.available = Number(new BigNumber(this.available.toString()).minus(this.pending.toString()).toFixed(7).toString()) ;
		this.other = Number(new BigNumber(this.total.toString()).minus(this.available.toString()).minus(this.pending.toString()).minus(this.sold.toString()).toFixed(7).toString());
		this.percentage = {
			sold: Number(new BigNumber(this.sold.toString()).dividedBy(this.total.toString()).times(100).toFixed(7).toString()),
			pending: Number(new BigNumber(this.pending.toString()).dividedBy(this.total.toString()).times(100).toFixed(7).toString()),
			other: Number(new BigNumber(this.other.toString()).dividedBy(this.total.toString()).times(100).toFixed(7).toString()),
			available: Number(new BigNumber(this.available.toString()).dividedBy(this.total.toString()).times(100).toFixed(7).toString()),
		}
    }

    async getTotalCoin(){
    	let response = await this.walletService.getTotalCoin();
    	if(!response.success){
    		return this.router.navigate(['/error', {message: this.t.transform(errors[response.error.errorCode])}]);
    	}
    	this.total = response.result;
    }

    async getAllIcoPackets(){
    	let response = await this.icoService.getAllIcoPackets();
    	if(!response.success){
            console.log(response.error.errorMessage);
    		return;
    	}
    	this.ico_packets = response.result;
    	this.ico_packets.forEach(function (packet) {
		packet.prices.forEach(function (price) {
			//-- Get All Register
			packet.registerDetails.forEach(function (registerDetail) {
				if (registerDetail.icoPacketPriceID === price._id) {
					let register = packet.registers.find(function (register) {
						return register._id === registerDetail.icoRegisterID;
					});
					if (register && register.status === 0) {
						this.sold = this.sold + Number(new BigNumber(packet.packetType.toString()).dividedBy(price.price).times(registerDetail.quantity).toString());
					} else {
						this.pending = this.pending + Number(new BigNumber(packet.packetType.toString()).dividedBy(price.price).times(registerDetail.quantity).toFixed(7).toString());;
					}
				}
			});
		});
	});
    }

    async getAllUserWallets(){
        let data = {
            with_assets: true
        }
    	let response = await this.walletService.getAllUserWallets(data);
    	if(!response.success){
            console.log(response.error.errorMessage);
    		return;
    	}
    	this.all_user_wallets = response.result || [];
    	this.all_user_wallets.forEach((wallet) => {
			if(!wallet.balances) return;
			wallet.balances.forEach((balance) => {
				if (balance.asset_type === 'native')
					this.available = Number(new BigNumber(this.available.toString()).plus(balance.balance.toString()).toFixed(7).toString());
			});
		});
    }

    async checkMaintenanceStatus(){
    	let response = await this.systemService.checkMaintenanceStatus();
    	if(!response.success){
            console.log(response.error.errorMessage);
    		return;
    	}
    	this.isMaintenance = response.result;
    }

    async getAsset(){
        let data = {
            asset_code: 'GBT'
        }
    	let response = await this.assetService.getAsset(data);
    	if(!response.success){
            console.log(response.error.errorMessage);
    		return;
    	}
    	this.asset = response.result;
    	this.GBTtotal = Number(new BigNumber(this.asset.capital).toFixed(7).toString());
    	this.getUserWallet();
    }

    async getUserWallet(){
    	let data = {};
    	data['id'] = this.asset.receiveFeeWalletID._id;
    	data['with_assets'] = true
    	let response = await this.walletService.getUserWallet(data);
    	if(!response.success){
            console.log(response.error.errorMessage);
    		return;
    	}
    	let user_wallet = response.result;
    	user_wallet.balances.forEach((balance) => {
			if (balance.asset_code === 'GBT') {
				this.GBTavailable = Number(new BigNumber(balance.balance.toString()).toFixed(7).toString());
				this.GBTother = Number(new BigNumber(this.GBTtotal.toString()).minus(this.GBTavailable.toString()).toFixed(7).toString());
				this.GBTpercentage = {
					other: Number(new BigNumber(this.GBTother.toString()).dividedBy(this.GBTtotal.toString()).times(100).toFixed(7).toString()),
					available: Number(new BigNumber(this.GBTavailable.toString()).dividedBy(this.GBTtotal.toString()).times(100).toFixed(7).toString()),
				}
			}
		})
    }

    async makeToggle(){
    	let response = await this.systemService.changeMaintenanceStatus(!this.isMaintenance);
    	if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
    		return;
    	}
    	this.isMaintenance = response.result;
    }

}

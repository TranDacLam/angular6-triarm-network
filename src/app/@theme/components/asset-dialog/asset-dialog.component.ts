import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { AssetService } from './../../../@core/services/asset.service';
import { WalletService } from './../../../@core/services/wallet.service';

declare var $: any;

@Component({
    selector: 'app-asset-dialog',
    templateUrl: './asset-dialog.component.html',
    styleUrls: ['./asset-dialog.component.scss']
})

export class AssetDialogComponent implements OnInit, OnChanges {

    @Output() on_asset_dialog = new EventEmitter();
	@Input() options: any;
    allAssets: Array<any> = [];
    ownedAssets: Array<any> = [];
    otherAssets: Array<any> = [];

    wallets: Array<any> = [];
    selectedWallet = null;
    loading: boolean = true;

    issuingAssets: Array<any> = [];
    filteredAssets = null;
    selectedAsset = null;
    assetFilter: string = "";
    filtering: boolean = false;

    constructor(
        private assetService: AssetService,
        private walletService: WalletService
    ) {
    }

    ngOnInit() {
      $('#assetDialog').on('hidden.bs.modal', (e) => {
        setTimeout(() =>{
          this.assetFilter = '';
          this.filteredAssets = null;
        }, 500)
      })
    }

    ngOnChanges(){
        if(this.options){
            this.getAllUserWallets();
            this.getAllUserAssets();
        }
        this.selectedAsset = null;
        this.selectedWallet = null;
    }

    async getAllAssets(){
        let response = await this.assetService.getAllAssets();
        if(!response.success){
            this.loading = false;
            return;
        }
        this.allAssets = response.result;
    }

    async getAllUserAssets(){
        let data = {
            withoutAdvance: this.options.withoutAdvance
        }
        let response = await this.assetService.getAllUserAssets(data);
        if(!response.success){
            this.loading = false;
            return;
        }
        this.issuingAssets = response.result;
    }

    async getAllUserWallets(){
        let data = {
            with_assets: true
        }
        let response = await this.walletService.getAllUserWallets(data);
        if(!response.success){
            this.loading = false;
            return;
        }
        this.wallets = response.result;
        await this.getAllAssets();

        this.ownedAssets = [];
        this.wallets.map((wallet) => { // why method some?????
            if (wallet.balances) {
                wallet.balances.forEach( (balance) => {
                    //-- check if ownedAssets has already contained this asset
                    let contain = false;
                    for (let b in this.ownedAssets) {
                        if (this.ownedAssets[b]._id === balance._id) {
                            contain = true;
                            break;
                        }
                    }
                    if (!contain) this.ownedAssets.push(balance);
                });
            }
        });

        this.otherAssets = [];
        this.allAssets.forEach( (asset) => {
            let contain = this.ownedAssets.some( (ownAsset) => {
                if (ownAsset._id === asset._id) return true;
            });
            if (!contain) {
                this.otherAssets.push(asset);
            }
        });
        this.loading = false;
    }

    OK(){
        let data ={
            selectedAsset: this.selectedAsset,
            selectedWallet: this.selectedWallet
        }
        this.on_asset_dialog.emit(data);
        $('#assetDialog').modal('hide');
    }

    changeWallet(selectedWallet) {
        this.selectedAsset = null;
        this.selectedWallet = selectedWallet;
    }
    
    selectAsset(asset) {
        this.selectedAsset = asset;
    };

    filterAsset(filter) {
        filter = filter.toLowerCase();
        this.filtering = true;
        if (this.otherAssets) {
            this.filteredAssets = this.otherAssets.filter( (asset) => {
                let u1 = asset.name ? asset.name.toLowerCase().indexOf(filter) >= 0 : false;
                let u2 = false; //asset.issuer && asset.issuer.name.toLowerCase().indexOf(filter);
                let u3 = false; //asset.issuer && asset.issuer.address.toLowerCase().indexOf(filter);
                return (filter === '@' || (filter && (u1 || u2 || u3)));
            });
        }
        this.filtering = false;
    }

    onError(event, item, arr){
        let index = arr.findIndex(balance => {
            return balance._id === item._id;
        });
        if(index >= 0){
            arr[index]['isErrorImage'] = true;
        }
    }
}

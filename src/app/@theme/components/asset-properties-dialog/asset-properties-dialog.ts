import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-asset-properties-dialog',
    templateUrl: './asset-properties-dialog.html',
    styleUrls: ['./asset-properties-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class AssetPropertiesDialogComponent implements OnInit {

	@Output() on_asset_properties_dialog = new EventEmitter();


    constructor(
    ) {
    }

    ngOnInit() {
    }

    OK(){
        this.on_asset_properties_dialog.emit();
        $('#assetPropertiesDialog').modal('hide');
    }

}

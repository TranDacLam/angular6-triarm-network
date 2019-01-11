import {
    Component, OnInit, Input, Output, 
    EventEmitter, OnChanges, ViewChild
} from '@angular/core';
import { NewsService } from '../../../@core/services/news.service';
import { UserService } from '../../../@core/services/user.service';
import { MultiSignService } from '../../../@core/services/multi-sign.service';
import { TranslatePipe } from './../../pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-set-option-wallet-dialog',
    templateUrl: './set-option-wallet-dialog.html',
    styleUrls: ['./set-option-wallet-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class SetOptionWalletDialog implements OnInit, OnChanges {

    @Input() unMutisignWallets: any;
    @Output() on_reset_option_wallet = new EventEmitter();

    @ViewChild('excelexport') excelexport: any;

    wallets: Array<any> = [];
    isGen: boolean = false;
    isLoading: boolean = false;
    isSetting: boolean = false;
    showBusyText: boolean = false;
    keypairs: Array<any> = [];
    stepData: Array<any> = [
        { step: 1, active: true, process: true, data: {
                walletType:'hot_wallet', selectedWallet: ''
            } 
        },
        { step: 2, active: false, process: false, data: {} },
        { step: 3, active: false, process: false, data: {} },
    ];

    option_extra: any;

    data_export: any[] = [];
    file_name_export: string = 'keypairs.csv';

    constructor(
        private newsService: NewsService,
        private userService: UserService,
        private multiSignService: MultiSignService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if(this.unMutisignWallets){
            this.wallets = this.unMutisignWallets;
        }
    }

    async nextStep(){
        if(this.stepData[0].process == true){
            this.stepData[0].process = false;
            this.stepData[1].active = true;
            this.stepData[1].process = true;
        }else if(this.stepData[1].process == true){
            this.stepData[1].process = false;
            this.stepData[2].active = true;
            this.stepData[2].process = true;
            if(!this.isSetting){
                let publicKeys = this.keypairs.map((keypair) => {
                    return keypair.publicKey;
                });
                let data = {
                    walletAddress: this.stepData[0].data.selectedWallet,
                    signers: publicKeys,
                    type: this.stepData[0].data.walletType
                }
                let response = await this.multiSignService.setupMultiSignWalletForAdmin(data);
                if(!response.success){
                    swal(
                        this.t.transform(errors[response.error.errorCode]),
                        '',
                        'error'
                    );
                    $('#setOptionWallet').modal('hide');
                    return this.on_reset_option_wallet.emit(true);
                }
                this.isSetting = true;
            }
        }
    }

    getKeys() {
        this.option_extra = {
            email: this.userService.current_user.email
        }
        $('#tfaConfirmDialog').modal('show');
    }

    async onConfirmTfa(event){
        this.isLoading = true;
        let data = {
            code: event
        }
        let response = await this.multiSignService.initKeypairForMultiSign(data);
        this.isLoading = false;
        if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
            return;
        }
        this.keypairs = response.result;
        this.downKeypairs(response.result);
        this.isGen = true;
    }

    downKeypairs(dataExport){
        this.data_export = dataExport;
        setTimeout( () => {
            this.excelexport.save();
        }, 500);
    }

    moveToPreviousStep(){
        this.stepData[0].process = true;
        this.stepData[1].active = false;
        this.stepData[1].process = false;
    }

    cancel(){
        swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('cancel_process_generate_new_key_wallet'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('yes_'),
            cancelButtonText: this.t.transform('no_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                this.on_reset_option_wallet.emit(true);
                $('#setOptionWallet').modal('hide');
            }
        });
    }

    done(){
        this.on_reset_option_wallet.emit(true);
        $('#setOptionWallet').modal('hide');
    }
}

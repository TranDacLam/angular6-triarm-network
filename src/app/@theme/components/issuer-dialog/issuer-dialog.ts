import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IssuerService } from './../../../@core/services/issuer.service';
import { UploadFileService } from './../../../@core/services/upload-file.service';
import { Helper } from './../../../@core/common/helper';

declare var $: any;

@Component({
    selector: 'app-issuer-dialog',
    templateUrl: './issuer-dialog.html',
    styleUrls: ['./issuer-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class IssuerDialog implements OnInit {

    @Output() changeSubmit = new EventEmitter();

    formIssuer: FormGroup;
    processing: boolean = false;
    agreed: boolean = false;
    msg_error: string = '';

    constructor(
    	private issuerService: IssuerService,
        private uploadFileService: UploadFileService,
    	public helper: Helper,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.createForm();
    }

    createForm(): void {
        this.formIssuer = this.fb.group({
            name: ['', [Validators.required]],
            address: ['', [Validators.required]],
            organization: ['', [Validators.required]],
            telNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(14)]],
            tokens: [''],
            totalOfTokens: [''],
            purposeIssue: [''],
            prSolution: [''],
            participantFeature: [''],
            numberUserEstimate: [''],
            issuerImage1: [null, [Validators.required]],
            issuerImage2: [null, [Validators.required]],
        });
    }


    onFileChangeIssuerImage(event, img){
        if(event.target.files && event.target.files.length > 0) {
            let file: any = event.target.files[0];
            let reader: any = new FileReader();
            if(img === 'img1'){
                reader.onload = (e: any) => {
                    $('#showIssuerImage1').attr('src', e.target.result);
                };
                reader.readAsDataURL(file);
                this.formIssuer.get('issuerImage1').setValue(file);
            }else{
                reader.onload = (e: any) => {
                    $('#showIssuerImage2').attr('src', e.target.result);
                };
                reader.readAsDataURL(file);
                this.formIssuer.get('issuerImage2').setValue(file);
            }
        }
    }

    async onSubmit(){
        this.processing = true;
        let data = {...this.formIssuer.value};
        data = JSON.parse(JSON.stringify(data));
        let issuerImage1 = this.formIssuer.value.issuerImage1;
        let issuerImage2 = this.formIssuer.value.issuerImage2;
        delete data["issuerImage1"];
        delete data["issuerImage2"];

        let response = await this.issuerService.becomeIssuer(data);
        if(!response.success){
            this.processing = false;
            return this.msg_error = response.error.errorMessage;
        }
        this.msg_error = '';
        let arr_img: Array<any> = [issuerImage1, issuerImage2];
        await this.uploadImagesIssuer(response.result, arr_img);
    }

    uploadImagesIssuer(result, arrImage){
        let done = 0;
        for (var i = 0; i < result.urlUpload.length; i++) {
            if (arrImage[i] !== null && result.urlUpload[i] !== null) {
                this.uploadFileService.uploadImages(result.urlUpload[i], arrImage[i]).subscribe(
                    (result) => {
                        done++;
                        console.log("result", result);
                        if(done === 2){
                            this.processing = false;
                            this.formIssuer.reset();
                            $('#issuerDialog').modal('hide');
                            this.changeSubmit.emit();
                        }
                    },
                    (error) => {
                        done ++;
                        console.log("error", error);
                        if(done === 2){
                            this.processing = false;
                            this.formIssuer.reset();
                            $('#issuerDialog').modal('hide');
                            this.changeSubmit.emit();
                        }
                    }
                );
            }
        }
    }

}

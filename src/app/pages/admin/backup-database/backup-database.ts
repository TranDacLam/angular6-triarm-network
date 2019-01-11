import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SystemService } from './../../../@core/services/system.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
    templateUrl: './backup-database.html',
    styleUrls: ['./backup-database.scss']
})

export class BackupDatabaseComponent implements OnInit {

	limit: number = 10;
	currentPage: number = 1;
	waitTableData: boolean = false;
	deleting: any = {};
	backuping: boolean = false;
	restoring: boolean = false;
	nextBackupAt: any = {};
	allBackupFiles: Array<any> = [];
	currentItems: Array<any> = [];
	timeInterval = null;
	backupFileName: string = '';
	timeFromNow: any;
	backupTime: any;

	TIME_FORMAT = 'DD.MM.YYYY HH:mm:ss Z';

    constructor(
    	private systemService: SystemService,
    	private t: TranslatePipe,
    	private router: Router
    ) {}

    ngOnInit() {
    	this.getAllBackupFiles();
    	setInterval(() => {
    		this.timeFromNow = moment().format(this.TIME_FORMAT);
	    	this.nextBackupAt.seconds = 59 - moment().seconds();
			this.nextBackupAt.minutes = 29 - ((this.nextBackupAt.seconds > 0) ? moment().minutes() : moment().minutes() - 1) % 30;
    	});
    }

    async getAllBackupFiles(){
    	this.waitTableData = true;
    	let response = await this.systemService.getAllBackupFiles();
    	this.waitTableData = false;
    	if(!response.success){
    		return;
    	}
    	this.allBackupFiles = response.result.sort((a,b)=>b['Key'].localeCompare(a['Key']));
    	this.currentItems = this.allBackupFiles.slice(0, this.limit);
    }

    pageChanged(event){
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.currentPage = event.page;
        this.currentItems = this.allBackupFiles.slice(startItem, endItem);
    }

    fileSizeFormat(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
	}

	deleteBackupFile(backup_file) {
		swal({
            title: this.t.transform('confirm_'),
            text: `${this.t.transform('delete_backup')} ${backup_file}?`,
            showCancelButton: true,
            confirmButtonText: this.t.transform('yes_delete'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
            	this.deleting[backup_file] = true;
                this.systemService.deleteBackupFile(backup_file).then(
                    (data) => {
                    	this.deleting[backup_file] = false;
                    	if(!data.success){
                            swal(
                                this.t.transform('CANT_DELETE_BACKUP_FILE'),
                                '',
                                'error'
                            );
                    		return;
                    	}
                    	var indexOfFileDeleted = this.allBackupFiles.findIndex( (backup) => {
							return backup.Key === backup_file;
						});
						this.allBackupFiles.splice(indexOfFileDeleted, 1);
						this.currentItems = this.allBackupFiles.slice(0, this.limit);
                    }
                )
            }
        });
	};

	async backupManually() {
		this.backuping = true;
		this.backupTime = moment().format(this.TIME_FORMAT);
		let response = await this.systemService.backupManually();
		this.backuping = false;
		if(!response.success){
            swal(
                this.t.transform(errors[response.error.errorCode]),
                '',
                'error'
            );
			return;
		}
		this.allBackupFiles.unshift(response.result);
		this.currentItems = this.allBackupFiles.slice(0, this.limit);
	};

	async restoreDatabase() {
		swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('restore_db'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('ok_'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
            	this.restoring = true;
                this.systemService.restoreDatabase(this.backupFileName).then(
                    (data) => {
                    	this.restoring = false;
                    	if(!data.success){
                            swal(
                                this.t.transform('ERROR_WHEN_RESTORE'),
                                '',
                                'error'
                            );
                    		return;
                    	}
                        swal(
                            this.t.transform('LOGIN_AGAIN'),
                            '',
                            'success'
                        );
                    	return this.router.navigate(['/login']);
                    }
                )
            }
        });
	};
}

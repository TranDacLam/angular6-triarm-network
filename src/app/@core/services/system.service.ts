import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class SystemService {


  constructor(private apiService: ApiService) {
  }

  async checkMaintenanceStatus() {
    const data = {
      name: 'check_maintenance_status',
      params: {
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async changeMaintenanceStatus(status) {
    const data = {
      name: 'change_maintenance_status',
      params: {
        status: status
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async getAllBackupFiles() {
    const data = {
      name: 'get_all_backup_files',
      params: {}
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async deleteBackupFile(backupFileName) {
    const data = {
      name: 'delete_backup_file',
      params: {
        backupFileName: backupFileName
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async backupManually() {
    const data = {
      name: 'backup_manually',
      params: {}
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async restoreDatabase(backupFileName) {
    const data = {
      name: 'restore_database',
      params: {
        backupFileName: backupFileName
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}

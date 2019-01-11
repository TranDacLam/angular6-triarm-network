import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

// import {api} from '../constant/api';

@Injectable({
    providedIn: 'root'
})
export class UploadFileService {


    constructor(private apiService: ApiService, private http: HttpClient) {
    }

    uploadImages(url, item): Observable<any>{
      return this.http.put(url, item, {headers: {"Content-Type": 'image/*'}}).map(
        (response) =>{
          return response;
        }
      );
    }
}

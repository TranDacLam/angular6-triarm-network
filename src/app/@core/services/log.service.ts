import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LogService {

    constructor() {}
    log(...messages: any[]): void {
        if (!environment.production) {
            console.log(messages);
        }
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TranslateService {

    data: Object = {};
    LANGUAGE = 'LANGUAGE';

    constructor(private http: HttpClient) {

    }

    use(lang: string): Promise<Object> {
        return new Promise<Object>((resolve) => {
            const langPath = `assets/locale/${lang}.json`;
            this.http.get<Object>(langPath).subscribe(
                translation => {
                    this.data = Object.assign({}, translation || {});
                    resolve(this.data);
                },
                error => {
                    this.data = {};
                    resolve(this.data);
                }
            );
        });
    }

}

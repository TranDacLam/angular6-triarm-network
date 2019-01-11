import {Pipe, PipeTransform} from '@angular/core';
import { TranslateService } from '../../@core/services/translate.service';

@Pipe({
    name: 't',
    pure: false
})

export class TranslatePipe implements PipeTransform {

    constructor(private translate: TranslateService) {}

    transform(value: any, args?: any): any {
        if (!value) {
            return '';
        }
        return this.translate.data[value] || value;
    }

}

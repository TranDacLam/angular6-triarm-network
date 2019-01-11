import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class Helper {

  constructor() {

  }

  getUnixTimeFromString(time) {
    return moment(time);
  }

  formatTime(time, format, newFormat) {
    return moment(time, format).format(newFormat);
  }

  getFormatedTimeDistance(time1, time2){
    var a = moment(time1);
    var b = moment(time2);
    return moment.utc(moment.duration(b.diff(a)).asMilliseconds()).format('HH:mm:ss' );
  }

  bitwiseAnd(a, b){
    return Number(a) & Number(b);
  }

  formatBytes(bytes,decimals) {
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
      dm = decimals || 1,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
}

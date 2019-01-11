import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class ErrorHandler {

  constructor(private router: Router) {

  }

  handle_error(error) {
    switch (error.errorCode) {
      case 12:
        return this.router.navigate(['/login', {message: error.errorMessage}]);
      case 116:
        return this.router.navigate(['/login', {message: error.errorMessage}]);
      case 3:
        return this.router.navigate(['/error', {message: error.errorMessage}]);
      default:
        return this.router.navigate(['/error', {message: 'other_error'}]);
    }
  }
}

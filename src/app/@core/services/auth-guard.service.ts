import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private apiService: ApiService, private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve) => {
      // if (!this.apiService.userToken || this.apiService.userToken['tokenExpiration'] < Date.now()) {
      if (!this.apiService.userToken) {
        // -- try reload
        await this.apiService.loadToken();
        if (!this.apiService.userToken) {
          this.router.navigate(['login']);
          return resolve(false);
        }
        return resolve(true);
      }
      return resolve(true);
    });
  }
}

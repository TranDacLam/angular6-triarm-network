import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';


import {LoginPage} from './pages/login/login';
import {HomePage} from './pages/home/home';
import {ForgotPasswordPage} from './pages/forgot-password/forgot-password';
import {NewAccountPage} from './pages/new-account/new-account';

import {ErrorPage} from './pages/error/error';
import {NotFoundPage} from './pages/not-found/not-found';
import { AuthGuardService } from './@core/services/auth-guard.service';
import { UserLoggedInService } from './@core/services/user-logged-in.service';
import { WalletModule } from './pages/wallet/wallet.module';
import { AdminModule } from './pages/admin/admin.module';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { 
    path: '', 
    component: HomePage,
    canActivate: [UserLoggedInService]
  },
  { 
    path: 'forgot-password', 
    component: ForgotPasswordPage,
    canActivate: [UserLoggedInService]
  },
  { 
    path: 'new-account', 
    component: NewAccountPage,
    canActivate: [UserLoggedInService]
  },
  { 
    path: 'login', 
    component: LoginPage,
    canActivate: [UserLoggedInService]
  },
  {
    path: 'wallet',
    loadChildren: './pages/wallet/wallet.module#WalletModule',
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin',
    loadChildren: './pages/admin/admin.module#AdminModule',
    canActivate: [AuthGuardService],
  },
  {
    path: 'error',
    component: ErrorPage
  },
  {
    path: 'not-found',
    component: NotFoundPage,
  },
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules,
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

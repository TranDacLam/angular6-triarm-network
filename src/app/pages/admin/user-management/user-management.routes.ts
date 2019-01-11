import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementPage } from './user-management';
import { IssuerComponent } from './issuer/issuer';
import { MerchantComponent } from './merchant/merchant';
import { ResendEmailComponent } from './resend-email/resend-email';
import { SubscriberComponent } from './subscriber/subscriber';
import { UserListComponent } from './user/user-list/user-list';
import { UserInfoComponent } from './user/user-info/user-info';

const routes: Routes = [
  {
    path: '',
    component: UserManagementPage,
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'user',
        component: UserListComponent,
      },
      {
        path: 'user/:armId',
        component: UserInfoComponent,
      },
      {
        path: 'issuer',
        component: IssuerComponent,
      },
      {
        path: 'merchant',
        component: MerchantComponent,
      },
      {
        path: 'resend-email',
        component: ResendEmailComponent,
      },
      {
        path: 'subscriber',
        component: SubscriberComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {
}

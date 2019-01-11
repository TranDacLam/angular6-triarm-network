import { NgModule } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { UserManagementPage } from './user-management';
import { IssuerComponent } from './issuer/issuer';
import { MerchantComponent } from './merchant/merchant';
import { ResendEmailComponent } from './resend-email/resend-email';
import { SubscriberComponent } from './subscriber/subscriber';
import { UserListComponent } from './user/user-list/user-list';
import { UserInfoComponent } from './user/user-info/user-info';

import { UserManagementRoutingModule } from './user-management.routes';
import { ThemeModule } from '../../../@theme/theme.module';

@NgModule({
  declarations: [
    UserManagementPage,
    IssuerComponent,
    MerchantComponent,
    ResendEmailComponent,
    SubscriberComponent,
    UserListComponent,
    UserInfoComponent,
  ],
  imports: [
    PaginationModule.forRoot(),
    AngularMultiSelectModule,
    UserManagementRoutingModule,
    ThemeModule,
  ],
  providers: [],
})

export class UserManagementModule {
}

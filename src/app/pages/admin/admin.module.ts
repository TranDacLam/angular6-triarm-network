import { NgModule } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { AdminRoutingModule } from './admin.routes';
import { ThemeModule } from '../../@theme/theme.module';

import { AdminPage } from './admin';
import { SummaryComponent } from './summary/summary';
import { MailComponent } from './mail/mail';
import { NewsComponent } from './news/news';
import { FirstWalletStoreComponent } from './first-wallet-store/first-wallet-store';
import { BackupDatabaseComponent } from './backup-database/backup-database';
import { MultisignComponent } from './multisign/multisign';
import { MultisignWalletsComponent } from './multisign/multisign-wallets/multisign-wallets';
import { MultisignTransactionComponent } from './multisign/multisign-transaction/multisign-transaction';
import { MultisignWalletSettingComponent } from './multisign/multisign-wallet-setting/multisign-wallet-setting';
@NgModule({
  declarations: [
    AdminPage,
    SummaryComponent,
    MailComponent,
    NewsComponent,
    FirstWalletStoreComponent,
    BackupDatabaseComponent,
    MultisignComponent,
    MultisignWalletsComponent,
    MultisignTransactionComponent,
    MultisignWalletSettingComponent,
  ],
  imports: [
    PaginationModule.forRoot(),
    AngularMultiSelectModule,
    AdminRoutingModule,
    ThemeModule,
  ],
  providers: [],
})

export class AdminModule {
}

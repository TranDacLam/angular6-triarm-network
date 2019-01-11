import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary';
import { AdminPage } from './admin';
import { MailComponent } from './mail/mail';
import { NewsComponent } from './news/news';
import { FirstWalletStoreComponent } from './first-wallet-store/first-wallet-store';
import { BackupDatabaseComponent } from './backup-database/backup-database';
import { UserManagementModule } from './user-management/user-management.module';
import { MultisignComponent } from './multisign/multisign';
import { MultisignWalletsComponent } from './multisign/multisign-wallets/multisign-wallets';
import { MultisignTransactionComponent } from './multisign/multisign-transaction/multisign-transaction';
import { MultisignWalletSettingComponent } from './multisign/multisign-wallet-setting/multisign-wallet-setting';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: '',
        component: SummaryComponent,
      },
      {
        path: '',
        redirectTo: '<summary></summary>',
        pathMatch: 'full'
      },
      {
        path: 'mail',
        component: MailComponent,
      },
      {
        path: 'news',
        component: NewsComponent,
      },
      {
        path: 'first-wallet-store',
        component: FirstWalletStoreComponent,
      },
      {
        path: 'backup-db',
        component: BackupDatabaseComponent,
      },
      {
        path: 'multisign',
        component: MultisignComponent,
        children: [
          {
            path: 'wallets',
            component: MultisignWalletsComponent,
          },
          {
            path: 'transaction',
            component: MultisignTransactionComponent,
          },
          {
            path: 'admin-wallet-setting',
            component: MultisignWalletSettingComponent,
          }
        ]
      },
      {
        path: 'user-management',
        loadChildren: './user-management/user-management.module#UserManagementModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}

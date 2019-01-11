import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { MyWalletsComponent } from './my-wallets/my-wallets';
import { WalletPage } from './wallet';
import { SettingsComponent } from './settings/settings';
import { MultisignUserWalletsComponent } from './multisign/multisign-wallets/multisign-wallets';
import { MultisignUserTransactionComponent } from './multisign/multisign-transaction/multisign-transaction';
import { MultisignUserWalletSettingComponent } from './multisign/multisign-wallet-setting/multisign-wallet-setting';
import { RestoreComponent } from './restore/restore';
import { AdvanceWalletsComponent } from './advance/advance-wallet/advance-wallet';
import { AdvanceSettingComponent } from './advance/advance-setting/advance-setting';
import { HistoryComponent } from './history/history';
import { ContactComponent } from './contact/contact';
import { ActiveWalletComponent } from './active/active';
import { MergeComponent } from './merge/merge';
import { NewWalletComponent } from './new/new';
import { IssueWalletComponent } from './issue/issue';
import { AdvanceTransactionComponent } from './advance/advance-transaction/advance-transaction';
import { AdvanceTransactionStatusComponent } from './advance/advance-transaction-status/advance-transaction-status';
import { AdvanceTransactionInfoComponent } from './advance/advance-transaction-info/advance-transaction-info';
import { AdvanceIssueComponent } from './advance/advance-issue/advance-issue';
import { MultisignUserIssueWalletComponent } from './multisign/multisign-issue/multisign-issue';
import { MultisignAssetPermissionWalletComponent } from './multisign/multisign-asset-permission/multisign-asset-permission';
import { TransactionWalletComponent } from './transaction/transaction';
import { AdvanceAssetPermissionWalletComponent } from './advance/advance-asset-permission/advance-asset-permission';
import { AssetPermissionWalletComponent } from './asset-permission/asset-permission';

const routes: Routes = [
  {
    path: '',
    component: WalletPage,
    children: [
      {
        path: 'my-wallets',
        component: MyWalletsComponent,
      },
      {
        path: '',
        redirectTo: 'my-wallets',
        pathMatch: 'full'
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'multisign-wallet',
        component: MultisignUserWalletsComponent,
      },
      {
        path: 'multisign-wallet-transaction',
        component: MultisignUserTransactionComponent,
      },
      {
        path: 'multisign-wallet-setting',
        component: MultisignUserWalletSettingComponent,
      },
      {
        path: 'restore',
        component: RestoreComponent,
      },
      {
        path: 'advance-wallet',
        component: AdvanceWalletsComponent,
      },
      {
        path: 'advance-setting',
        component: AdvanceSettingComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
      {
        path: 'contacts',
        component: ContactComponent,
      },
      {
        path: 'active',
        component: ActiveWalletComponent,
      },
      {
        path: 'merge',
        component: MergeComponent,
      },
      {
        path: 'new',
        component: NewWalletComponent,
      },
      {
        path: 'issue',
        component: IssueWalletComponent,
      },
      {
        path: 'advance/payment',
        component: AdvanceTransactionComponent,
      },
      {
        path: 'advance-transaction',
        component: AdvanceTransactionStatusComponent,
      },
      {
        path: 'advance-transaction/:id',
        component: AdvanceTransactionInfoComponent,
      },
      {
        path: 'advance-issuer',
        component: AdvanceIssueComponent,
      },
      {
        path: 'multisign-issuer',
        component: MultisignUserIssueWalletComponent,
      },
      {
        path: 'multisign-asset-permission',
        component: MultisignAssetPermissionWalletComponent,
      },
      {
        path: 'transaction',
        component: TransactionWalletComponent,
      },
      {
        path: 'advance-asset-permission',
        component: AdvanceAssetPermissionWalletComponent
      },
      {
        path: 'asset-permission',
        component: AssetPermissionWalletComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule {
}

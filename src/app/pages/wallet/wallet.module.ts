import {NgModule} from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatSliderModule } from '@angular/material/slider';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { WalletPage } from './wallet';
import { MyWalletsComponent } from './my-wallets/my-wallets';
import { WalletRoutingModule } from './wallet.routes';
import { ThemeModule } from '../../@theme/theme.module';
import { SettingsComponent } from './settings/settings';
import { MultisignUserWalletsComponent } from './multisign/multisign-wallets/multisign-wallets';
import { MultisignUserTransactionComponent } from './multisign/multisign-transaction/multisign-transaction';
import { MultisignUserWalletSettingComponent } from './multisign/multisign-wallet-setting/multisign-wallet-setting';
import { RestoreComponent } from './restore/restore';
import { AdvanceWalletsComponent } from './advance/advance-wallet/advance-wallet';
import { AdvanceSettingComponent } from './advance/advance-setting/advance-setting';
import { HistoryComponent } from './history/history';
import { HistoryTabComponent } from './history/history-tab/history-tab';
import { ContactComponent } from './contact/contact';
import { ActiveWalletComponent } from './active/active';
import { MergeComponent } from './merge/merge';
import { NewWalletComponent } from './new/new';
import { IssueWalletComponent } from './issue/issue';
import { NewAssetIssueComponent } from './issue/new-asset/new-asset';
import { NewIssuingIssueComponent } from './issue/new-issuing/new-issuing';
import { ConvertAssetIssueComponent } from './issue/convert-asset/convert-asset';
import { AdvanceTransactionComponent } from './advance/advance-transaction/advance-transaction';
import { AdvanceTransactionStatusComponent } from './advance/advance-transaction-status/advance-transaction-status';
import { AdvanceTransactionInfoComponent } from './advance/advance-transaction-info/advance-transaction-info';
import { AdvanceIssueComponent } from './advance/advance-issue/advance-issue';
import { NewIssuingAdvanceIssueComponent } from './advance/advance-issue/new-issuing/new-issuing';
import { NewAssetAdvanceIssueComponent } from './advance/advance-issue/new-asset/new-asset';
import { ConvertAssetAdvanceIssueComponent } from './advance/advance-issue/convert-asset/convert-asset';
import { MultisignUserIssueWalletComponent } from './multisign/multisign-issue/multisign-issue';
import { NewAssetMultisignUserIssueComponent } from './multisign/multisign-issue/new-asset/new-asset';
import { NewIssuingMultisignUserIssueComponent } from './multisign/multisign-issue/new-issuing/new-issuing';
import { ConvertAssetMultisignUserIssueComponent } from './multisign/multisign-issue/convert-asset/convert-asset';
import { MultisignAssetPermissionWalletComponent } from './multisign/multisign-asset-permission/multisign-asset-permission';
import { TransactionWalletComponent } from './transaction/transaction';
import { AdvanceAssetPermissionWalletComponent } from './advance/advance-asset-permission/advance-asset-permission';
import { AssetPermissionWalletComponent } from './asset-permission/asset-permission';

@NgModule({
  declarations: [
    WalletPage,
    MyWalletsComponent,
    SettingsComponent,
    MultisignUserWalletsComponent,
    MultisignUserTransactionComponent,
    MultisignUserWalletSettingComponent,
    RestoreComponent,
    AdvanceWalletsComponent,
    AdvanceSettingComponent,
    HistoryComponent,
    HistoryTabComponent,
    ContactComponent,
    ActiveWalletComponent,
    MergeComponent,
    NewWalletComponent,
    IssueWalletComponent,
    NewAssetIssueComponent,
    NewIssuingIssueComponent,
    ConvertAssetIssueComponent,
    AdvanceTransactionComponent,
    AdvanceTransactionStatusComponent,
    AdvanceTransactionInfoComponent,
    AdvanceIssueComponent,
    NewIssuingAdvanceIssueComponent,
    NewAssetAdvanceIssueComponent,
    ConvertAssetAdvanceIssueComponent,
    MultisignUserIssueWalletComponent,
    NewAssetMultisignUserIssueComponent,
    NewIssuingMultisignUserIssueComponent,
    ConvertAssetMultisignUserIssueComponent,
    MultisignAssetPermissionWalletComponent,
    TransactionWalletComponent,
    AdvanceAssetPermissionWalletComponent,
    AssetPermissionWalletComponent,
  ],
  imports: [
    PaginationModule.forRoot(),
    WalletRoutingModule,
    ThemeModule,
    MatSliderModule,
    AngularMultiSelectModule
  ],
  providers: [],
})

export class WalletModule {
}

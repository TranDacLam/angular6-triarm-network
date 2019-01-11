import { ModuleWithProviders, NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';

import { TranslatePipe } from './pipes/translate.pipe';
import { Header } from './layouts/header/header';
import { Footer } from './layouts/footer/footer';
import { AlertMessagesComponent } from './components/alert-messages/alert-messages.component';
import { ButtonComponent } from './components/button/button.component';
import { NewsDetailDialog } from './components/news-detail-dialog/news-detail-dialog';
import { ShowErrorValidComponent } from './components/show-error-valid/show-error-valid.component';
import { TranslateService } from '../@core/services/translate.service';
import { InputComponent } from './components/input/input.component';
import { TfaConfirmComponent } from './components/tfa-confirm/tfa-confirm.component';
import { MenuWallet } from './layouts/menu-wallet/menu-wallet';
import { MenuAdmin } from './layouts/menu-admin/menu-admin';
import { IssuerRequestHistoryDialog } from './components/issuer-request-history-dialog/issuer-request-history-dialog';
import { IssuerDialog } from './components/issuer-dialog/issuer-dialog';
import { ChangePasswordDialog } from './components/change-password-dialog/change-password-dialog';
import { InputDialog } from './components/input-dialog/input-dialog';
import { VerifyGaDialog } from './components/verify-ga-dialog/verify-ga-dialog';
import { VerifyEmailAddressDialog } from './components/verify-email-address-dialog/verify-email-address-dialog';
import { NewsDialog } from './components/news-dialog/news-dialog';
import { EditUserInfoDialog } from './components/edit-user-info-dialog/edit-user-info-dialog';
import { ResetTfaDialog } from './components/reset-tfa-dialog/reset-tfa-dialog';
import { AdminEmailAddressDialog } from './components/admin-email-address-dialog/admin-email-address-dialog';
import { SetOptionWalletDialog } from './components/set-option-wallet-dialog/set-option-wallet-dialog';
import { WalletMultiSignComponent } from './components/multisign/wallet/wallet.component';
import { AssetMultiSignComponent } from './components/multisign/asset/asset.component';
import { ModeMultiSignDialogComponent } from './components/multisign/mode-dialog/mode-dialog.component';
import { AssetDialogComponent } from './components/asset-dialog/asset-dialog.component';
import { ContactSelectDialog } from './components/contact-select-dialog/contact-select-dialog';
import { WalletDialog } from './components/wallet-dialog/wallet-dialog';
import { PrivateKeyDialog } from './components/private-key-dialog/private-key-dialog';
import { SummaryDialogComponent } from './components/transaction/summary-dialog/summary-dialog';
import { AssetMultiSignUserComponent } from './components/multisign-user/asset/asset.component';
import { ModeDialogMultiSignUserComponent } from './components/multisign-user/mode-dialog/mode-dialog.component';
import { WalletMultiSignUserComponent } from './components/multisign-user/wallet/wallet.component';
import { SetOptionWalletUserDialog } from './components/multisign-user/set-option-wallet-dialog/set-option-wallet-dialog';
import { WalletAdvanceComponent } from './components/advance/wallet/wallet.component';
import { AssetDialogMultiSignComponent } from './components/advance/asset-dialog/asset-dialog.component';
import { ChooseSignerDialogComponent } from './components/advance/choose-signer-dialog/choose-signer-dialog';
import { AssetAdvanceComponent } from './components/advance/asset/asset.component';
import { ModeAdvanceDialogComponent } from './components/advance/mode-dialog/mode-dialog.component';
import { WalletAdvanceDialog } from './components/advance/wallet-dialog/wallet-dialog';
import { SetWalletPropertiesDialogComponent } from './components/set-wallet-properties-dialog/set-wallet-properties-dialog';
import { AssetPropertiesDialogComponent } from './components/asset-properties-dialog/asset-properties-dialog';
import { DisablePaymentDialogComponent } from './components/disable-payment-dialog/disable-payment-dialog';
import { WalletComponent } from './components/wallet/wallet.component';
import { ModeDialogComponent } from './components/mode-dialog/mode-dialog.component';
import { AssetComponent } from './components/asset/asset.component';
import { WalletActiveDialog } from './components/wallet-active-dialog/wallet-active-dialog';
import { UnblockWalletDialog } from './components/unblock-wallet-dialog/unblock-wallet-dialog';
import { TfaConfirmSetOptionWallet } from './components/multisign-user/tfa-confirm-set-option-wallet/tfa-confirm-set-option-wallet';
import { WalletDialogMultiSignUser } from './components/multisign-user/wallet-dialog/wallet-dialog';
import { AssetDialogMultiSignUserComponent } from './components/multisign-user/asset-dialog/asset-dialog.component';

import { RouterModule } from '@angular/router';

const BASE_MODULES: any = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  CKEditorModule,
  ExcelExportModule,
];

const COMPONENTS: any = [
  AlertMessagesComponent,
  ButtonComponent,
  InputComponent,
  NewsDetailDialog,
  ShowErrorValidComponent,
  TfaConfirmComponent,
  Header,
  Footer,
  MenuWallet,
  MenuAdmin,
  IssuerRequestHistoryDialog,
  IssuerDialog,
  ChangePasswordDialog,
  InputDialog,
  VerifyGaDialog,
  VerifyEmailAddressDialog,
  NewsDialog,
  EditUserInfoDialog,
  ResetTfaDialog,
  AdminEmailAddressDialog,
  SetOptionWalletDialog,
  WalletMultiSignComponent,
  AssetMultiSignComponent,
  ModeMultiSignDialogComponent,
  AssetDialogComponent,
  ContactSelectDialog,
  WalletDialog,
  PrivateKeyDialog,
  SummaryDialogComponent,
  AssetMultiSignUserComponent,
  ModeDialogMultiSignUserComponent,
  WalletMultiSignUserComponent,
  SetOptionWalletUserDialog,
  WalletAdvanceComponent,
  AssetDialogMultiSignComponent,
  ChooseSignerDialogComponent,
  AssetAdvanceComponent,
  ModeAdvanceDialogComponent,
  WalletAdvanceDialog,
  SetWalletPropertiesDialogComponent,
  AssetPropertiesDialogComponent,
  DisablePaymentDialogComponent,
  WalletComponent,
  ModeDialogComponent,
  AssetComponent,
  WalletActiveDialog,
  UnblockWalletDialog,
  TfaConfirmSetOptionWallet,
  WalletDialogMultiSignUser,
  AssetDialogMultiSignUserComponent,
];

const PIPES: any = [
  TranslatePipe,
];

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('en');
}

@NgModule({
  imports: [...BASE_MODULES],
  exports: [...BASE_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
})

export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [
        TranslatePipe,
        {
          provide: APP_INITIALIZER,
          useFactory: setupTranslateFactory,
          deps: [TranslateService],
          multi: true
        },
      ],
    };
  }
}

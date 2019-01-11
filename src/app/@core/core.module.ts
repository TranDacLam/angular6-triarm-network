import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandler } from './common/handle-error';
import { Helper } from './common/helper';
import { ApiService } from './services/api.service';
import { AuthGuardService } from './services/auth-guard.service';
import { UserLoggedInService } from './services/user-logged-in.service';
import { IcoService } from './services/ico.service';
import { LogService } from './services/log.service';
import { NewsService } from './services/news.service';
import { TranslateService } from './services/translate.service';
import { UserService } from './services/user.service';
import { AssetService } from './services/asset.service';
import { SystemService } from './services/system.service';
import { WalletService } from './services/wallet.service';
import { EmailService } from './services/email.service';
import { MultiSignService } from './services/multi-sign.service';
import { TransactionService } from './services/transaction.service';
import { MSWalletService } from './services/ms-wallet.service';
import { MSAssetService } from './services/ms-asset.service';
import { SocketService } from './services/socket.service';
import { MSTransactionService } from './services/ms-transaction.service';
import { UploadFileService } from './services/upload-file.service';
import { MSIssuerService } from './services/ms-issuer.service';
import { MultiSignUserService } from './services/multi-sign-user.service';
import { PendingTransactionService } from './services/pending-transaction.service';

export const COMMON = [
    ErrorHandler,
    Helper
];

export const SERVICES = [

];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [],
  declarations: [],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
          ...COMMON,
          ...SERVICES,
      ],
    };
  }
}

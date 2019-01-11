import {NgModule} from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ForgotPasswordPage } from './forgot-password';

@NgModule({
  declarations: [
    ForgotPasswordPage
  ],
  imports: [
    ThemeModule,
  ],
  providers: [],
})

export class ForgotPasswordModule {}

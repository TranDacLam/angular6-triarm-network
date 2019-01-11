import {NgModule} from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    ThemeModule,
  ],
  providers: [],
})

export class LoginModule {}

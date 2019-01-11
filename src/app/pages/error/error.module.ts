import {NgModule} from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ErrorPage } from './error';

@NgModule({
  declarations: [
    ErrorPage
  ],
  imports: [
    ThemeModule,
  ],
  providers: [],
})

export class ErrorModule {}

import {NgModule} from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NewAccountPage } from './new-account';

@NgModule({
  declarations: [
    NewAccountPage
  ],
  imports: [
    ThemeModule,
  ],
  providers: [],
})

export class NewAccountModule {}

import {NgModule} from '@angular/core';
import { HomePage } from './home';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    ThemeModule,
  ],
  providers: [],
})

export class HomeModule {}

import {NgModule} from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NotFoundPage } from './not-found';

@NgModule({
  declarations: [
    NotFoundPage
  ],
  imports: [
    ThemeModule,
  ],
  providers: [],
})

export class NotFoundModule {}

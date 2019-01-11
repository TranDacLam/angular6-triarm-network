import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ThemeModule } from './@theme/theme.module';
import { CoreModule } from './@core/core.module';
import { HomeModule } from './pages/home/home.module';
import { NotFoundModule } from './pages/not-found/not-found.module';
import { ErrorModule } from './pages/error/error.module';
import { LoginModule } from './pages/login/login.module';
import { ForgotPasswordModule } from './pages/forgot-password/forgot-password.module';
import { NewAccountModule } from './pages/new-account/new-account.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),

    ThemeModule.forRoot(),
    CoreModule.forRoot(),

    HomeModule,
    NotFoundModule,
    ErrorModule,
    LoginModule,
    ForgotPasswordModule,
    NewAccountModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

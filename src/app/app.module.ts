import {AuthenticationService} from './_services/authentication.service';
import {ErrorHandlingService} from './_services/error-handling.service';
import {ngxLoadingAnimationTypes, NgxLoadingModule} from 'ngx-loading';
import {RegisterComponent} from './auth/register/register.component';
import {SideBarComponent} from './core/side-bar/side-bar.component';
import {ReportComponent} from './core/report/report.component';
import {LoaderComponent} from './core/loader/loader.component';
import {LoginComponent} from './auth/login/login.component';
import {CalcComponent} from './core/calc/calc.component';
import {HomeComponent} from './core/home/home.component';
import {LoaderService} from './_services/loader.service';
import {DomainService} from './_services/domain.service';
import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AuthGuard} from './_guard/auth.guard';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {APIS, BASE_PATH} from '../../out';
import {AppConfig} from './app.config';
import {FlexLayoutModule} from '@angular/flex-layout';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const appRoutes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'calculator', component: CalcComponent, canActivate: [AuthGuard]},
  {path: 'reports', component: ReportComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''}
];

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

const basePathFactory = () => {
  return AppConfig.settings.apiBaseUrl;
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoaderComponent,
    SideBarComponent,
    CalcComponent,
    ReportComponent,
    RegisterComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    })
  ],
  providers: [AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    },
    AuthenticationService,
    ErrorHandlingService,
    CookieService,
    DomainService,
    LoaderService,
    AuthGuard,
    APIS,
    {provide: BASE_PATH, useFactory: basePathFactory}],
  bootstrap: [AppComponent]
})
export class AppModule {
}

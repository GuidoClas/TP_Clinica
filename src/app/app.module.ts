import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersListComponent } from './components/users-list/users-list.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { HomeComponent } from './components/home/home.component';
import { ParseDNIPipe } from './pipes/DNI/parse-dni.pipe';
import { TurnApplicationComponent } from './components/turn-application/turn-application.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PatientsComponent } from './components/patients/patients.component';
import { StatsComponent } from './components/stats/stats.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { BoldDirective } from './directives/bold.directive';
import { GrowDirective } from './directives/grow.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { ParseTimePipe } from './pipes/Time/parse-time.pipe';

const material = [
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatButtonModule,
  MatListModule,
  MatFormFieldModule,
  MatMenuModule
];

const captcha = [
  RecaptchaModule,
  RecaptchaFormsModule
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    UsersListComponent,
    HomeComponent,
    TurnApplicationComponent,
    ProfileComponent,
    PatientsComponent,
    StatsComponent,
    BarChartComponent,
    BoldDirective,
    GrowDirective,
    HighlightDirective,
    ParseTimePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    ...material,
    ...captcha
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

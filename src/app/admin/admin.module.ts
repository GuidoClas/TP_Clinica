import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AuthService } from '../services/Auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ParseDNIPipe } from '../pipes/DNI/parse-dni.pipe';


@NgModule({
  declarations: [
    UsersComponent,
    CreateUserComponent,
    ParseDNIPipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
  ]
})
export class AdminModule { }

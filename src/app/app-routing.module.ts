import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TurnApplicationComponent } from './components/turn-application/turn-application.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'register', 
    component: RegisterComponent, 
  },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [RoleGuard],
    data: { roles: ["0", "1", "2"] }
  },
  { 
    path: 'request-turn', 
    component: TurnApplicationComponent,
    canActivate: [RoleGuard],
    data: { roles: ["0", "2"] }
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: ["0", "1", "2"] }
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [RoleGuard],
    data: { roles: ["0"] }
  },
  { 
    path: '**', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
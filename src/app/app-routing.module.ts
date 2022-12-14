import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PatientsComponent } from './components/patients/patients.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { StatsComponent } from './components/stats/stats.component';
import { TurnApplicationComponent } from './components/turn-application/turn-application.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    data: { animation: 'log-in-page' }
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    data: { animation: 'sign-up-page' } 
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
    path: 'stats', 
    component: StatsComponent,
    canActivate: [RoleGuard],
    data: { roles: ["0"] }
  },
  { 
    path: 'patients', 
    component: PatientsComponent,
    canActivate: [RoleGuard],
    data: { roles: ["0","1"] }
  },
  { 
    path: 'turns', 
    loadChildren: () => import('./turns/turns.module').then(m => m.TurnsModule),
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
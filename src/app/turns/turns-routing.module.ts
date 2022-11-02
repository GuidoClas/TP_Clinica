import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectGuard } from '../guards/redirect.guard';
import { RoleGuard } from '../guards/role.guard';
import { AdminComponent } from './components/admin/admin.component';
import { PatientComponent } from './components/patient/patient.component';
import { SpecialistComponent } from './components/specialist/specialist.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    data: { roles: ['0'] },
    canActivate: [RoleGuard],
  },
  {
    path: 'specialist',
    component: SpecialistComponent,
    data: { roles: ['1'] },
    canActivate: [RoleGuard],
  },
  {
    path: 'patient',
    component: PatientComponent,
    data: { roles: ['2'] },
    canActivate: [RoleGuard],
  },
  {
    path: '**',
    component: PatientComponent,
    canActivate: [RedirectGuard],
    data: {
      redirects: [
        { role: '0', route: 'turns/admin' },
        { role: '1', route: 'turns/specialist' },
        { role: '2', route: 'turns/patient' },
      ],
    },
  },
];
/*
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'admin',
        component: AdminComponent,
        data: { role: '0' },
        canActivate: [],
      },
      {
        path: 'specialist',
        component: SpecialistComponent,
        data: { role: '1' },
        canActivate: [],
      },
      {
        path: 'patient',
        component: PatientComponent,
        data: { role: '2' },
        canActivate: [],
      },
    ],
  },
];*/

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TurnsRoutingModule {}

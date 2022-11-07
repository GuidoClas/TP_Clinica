import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnsRoutingModule } from './turns-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { SpecialistComponent } from './components/specialist/specialist.component';
import { PatientComponent } from './components/patient/patient.component';
import { TurnsComponent } from './turns.component';
import { TurnTableComponent } from './components/turn-table/turn-table.component';


import {MatSliderModule} from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpecialistFilterComponent } from './components/specialist-filter/specialist-filter.component';
import { HistoryComponent } from './components/history/history.component';


@NgModule({
  declarations: [
    TurnsComponent,
    AdminComponent,
    SpecialistComponent,
    PatientComponent,
    TurnTableComponent,
    SpecialistFilterComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    TurnsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSliderModule
  ],
  bootstrap: [TurnsComponent]
})
export class TurnsModule { }

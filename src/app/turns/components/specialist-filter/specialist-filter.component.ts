import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Specialtie } from 'src/app/models/Specialties/specialties';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { SpecialtiesService } from 'src/app/services/Specialties/specialties.service';

@Component({
  selector: 'app-specialist-filter',
  templateUrl: './specialist-filter.component.html',
  styleUrls: ['./specialist-filter.component.css']
})
export class SpecialistFilterComponent implements OnInit {
  @Output() public especialista : EventEmitter<string> = new EventEmitter();

  public specialties : Specialtie[] = [];
  public specialists : any[] = [];

  constructor(
    private specialtiesService : SpecialtiesService,
    private AuthService : AuthService
  ) {
  }

  async ngOnInit() {
    this.specialties = await this.specialtiesService.getSpecialties();
  }

  elegirEspecialidad( especialidad? : string ) {
    this.traerEspecialistas( especialidad );
    
  }

  elegirEspecialista( especialista : any ) {
    this.especialista.emit( especialista.email );
  }

  private async traerEspecialistas ( especialidad? : string ) {
    if ( !especialidad ) return
    console.log(especialidad);
    this.specialists = await this.AuthService.getEspecialistasPorEspecialidad( especialidad );
    
  }

}

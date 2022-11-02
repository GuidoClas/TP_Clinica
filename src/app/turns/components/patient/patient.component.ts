import { Component, OnInit } from '@angular/core';
import { Turn } from 'src/app/models/Turn/turn';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  public user? : Usuario;

  public mostrarEspecialista : boolean = true;
  public mostrarTurno : boolean = false;

  public turns? : any[] = [];

  constructor(
    private AuthService : AuthService,
    private turnService : TurnService
  ) { 
    this.user = this.AuthService.userLogged;
  }

  async ngOnInit() {
    this.turns = await this.turnService.getByPatient(this.user?.email);
  }

  public async elegidoEspecialista ( especialistaMail : string ) {
    this.turns = (await this.turnService.getBySpecialist( especialistaMail ))
      .filter( (turno: any) => turno.paciente === this.user?.email );
  }

  public elegidoTurnos ( turns : Turn[] ) {
    this.turns = turns;
  }

  public filtrarPorEspecialista() {
    this.turns = [];
    this.mostrarEspecialista = !this.mostrarEspecialista;
    this.mostrarTurno = false;
  }

  public filtrarPorTurno() {
    this.turns= [];
    this.mostrarTurno = !this.mostrarTurno;
    this.mostrarEspecialista = false;
  }

}

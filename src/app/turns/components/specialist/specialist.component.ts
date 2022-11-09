import { Component, OnInit } from '@angular/core';
import { Turn } from 'src/app/models/Turn/turn';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-specialist',
  templateUrl: './specialist.component.html',
  styleUrls: ['./specialist.component.css']
})
export class SpecialistComponent implements OnInit {
  public mostrarEspecialista : boolean = true;
  public mostrarTurno : boolean = false;

  public user? : Usuario;

  public turns? : any[] = [];

  constructor(
    private AuthService : AuthService,
    private turnService : TurnService
  ) { 
    this.user = this.AuthService.userLogged;
  }

  async ngOnInit() {
    this.turns = await this.turnService.getBySpecialist( this.user?.email );
  }

  public elegidoTurnos ( turns : Turn[] ) {
    this.turns = turns;
  }

  public filtrarPorTurno() {
    this.mostrarTurno = !this.mostrarTurno;
    this.mostrarEspecialista = false;
  }

}

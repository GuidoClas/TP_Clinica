import { Component, OnInit } from '@angular/core';
import { Turn } from 'src/app/models/Turn/turn';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public mostrarEspecialista : boolean = true;
  public mostrarTurno : boolean = false;

  public turns? : any[] = [];

  constructor(
    private turnService : TurnService
  ) { }

  async ngOnInit() {
    this.turns = await this.turnService.getAll();
  }

  public async elegidoEspecialista ( especialistaMail : string ) {
    this.turns = await this.turnService.getBySpecialist( especialistaMail );
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

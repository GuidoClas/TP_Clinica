import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Turn } from 'src/app/models/Turn/turn';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-turn-table',
  templateUrl: './turn-table.component.html',
  styleUrls: ['./turn-table.component.css']
})
export class TurnTableComponent implements OnInit {
  @Input() public turns? : any[] = [];
  public user? : Usuario;

  public indexTurnoElegido : number = -1;
  public resenya : boolean = false;
  public encuesta : boolean = false;
  public turnoCancelado : boolean = false;

  public idFinalizado? : string = undefined;

  public texto = "";

  constructor(
    private turnService : TurnService,
    private AuthService : AuthService
  ) {
    this.user = this.AuthService.userLogged;
  }

  ngOnInit(): void {
  }

  actualizarTurno ( turno : any, target : any, atributo : any ) {
    turno[atributo] = target.value;
    this.turnService.updateTurn( turno );
  }

  actualizarTurnoValor ( turno : any, valor : any, atributo : any ) {
    turno[atributo] = valor;
    this.turnService.updateTurn( turno );
  }

  actualizarTurnoChecked ( turno : any, target : any, atributo : any ) {
    turno[atributo] = target.checked;
    this.turnService.updateTurn( turno );
    this.prepararReseniaCancelado( turno );
  }

  async finalizarTurno ( turno : any, target : any ) {
    await this.actualizarTurnoChecked(turno, target, 'finalizado');

    if ( target.checked ) {
      this.settearFinalizado( turno );
      return
    }

    if ( !target.checked && this.idFinalizado === turno.id ) 
      this.idFinalizado = "";
  }

  settearFinalizado( turno : any ) {
    this.idFinalizado = undefined;
    setTimeout( () => {
      this.idFinalizado = turno.id;
      }, 1000 );
  }

  prepararResenya( index : number ) {
    this.indexTurnoElegido = index;
    const turno = this.turns![index];

    if ( !turno.resenia ){
      this.resenya = true;
      this.texto = "No hay una reseña cargada para este turno.";
      return
    }
    
    this.texto = turno.resenia;
  }

  prepararEncuesta( index : number ) {
    this.indexTurnoElegido = index;
    const turno = this.turns![index];

    if ( !turno.encuesta ) {
      this.encuesta = true;
      this.texto = "";
      return
    }

    this.texto = turno.encuesta;
  }

  prepararReseniaCancelado( turno : any ) {
    let index = this.turns?.findIndex((t) => {
      return t.fecha == turno.fecha && t.paciente == turno.paciente;
    });
    this.indexTurnoElegido = index!;
    if ( !turno.reseniaCancelado ) {
      this.turnoCancelado = true;
      this.texto = "";
      return
    }

    this.texto = turno.reseniaCancelado;
  }
  
  actualizarEncuesta() {

    if ( this.encuesta ) {
      const turno = this.turns![this.indexTurnoElegido];
      turno.encuesta = this.texto;
      this.encuesta = false;
      this.actualizarTurnoValor( turno, this.texto, 'encuesta' );
    }

  }

  actualizarResenya() {
    
    if ( this.resenya ) {
      const turno = this.turns![this.indexTurnoElegido];
      turno.resenia = this.texto;
      this.resenya = false;
      this.actualizarTurnoValor( turno, this.texto, 'resenia' );
    }

  }

  actualizarReseniaCancelado() {
    if ( this.turnoCancelado ) {
      const turno = this.turns![this.indexTurnoElegido];
      turno.reseniaCancelado = this.texto;
      this.turnoCancelado = false;
      this.actualizarTurnoValor( turno, this.texto, 'reseniaCancelado' );
    }
  }

  salirDelModal() {
    this.encuesta = false;
    this.resenya = false;
  }

}

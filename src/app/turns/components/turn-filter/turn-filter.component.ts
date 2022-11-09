import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Turn } from 'src/app/models/Turn/turn';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-turn-filter',
  templateUrl: './turn-filter.component.html',
  styleUrls: ['./turn-filter.component.css']
})
export class TurnFilterComponent implements OnInit {
  @Output() turnos : EventEmitter<Turn[]> = new EventEmitter<Turn[]>();
  @Input() patient? : Usuario;
  @Input() specialist? : Usuario;
  
  private allTurns? : Turn[] = [];

  constructor(private turnService : TurnService) { }

  async ngOnInit() {
    this.allTurns = await this.turnService.getAll();
  }

  onSearch( target : any ) {
    let turnos = [];
    const valor = target.value;

    for ( let turno of this.allTurns! ) {
      if ( this.chequearValor( turno, valor ) ) {
        turnos.push(turno);
        continue
      }
    }
    console.log(turnos);
    turnos = this.filtrar( turnos );
    this.turnos.emit( turnos );
  }

  private chequearValor( turno : Turn, valor : string ) {
    
    for ( let turnoValor of Object.values(turno) ) {
      if ( turnoValor.toString().indexOf( valor ) > -1 ){
        return true;
      } 
    }

    const historia : any = turno.historia;
    if ( !historia ) return false;

    const historiaValues : any = Object.values(historia);

    console.log(historiaValues);
    for ( let historiaValor of historiaValues ) {
      if ( historiaValor.toString().indexOf( valor ) > -1 ) return true;
    }

    return false;
  }

  private filtrar( turnos : Turn[] ) {
    if ( this.patient ) 
      return this.filtrarPorPaciente(turnos);
    if( this.specialist )
      return this.filtrarPorEspecialista(turnos);
    return turnos;
  }

  private filtrarPorPaciente( turnos : Turn[] ) {
    return turnos.filter( (turno) => turno.paciente === this.patient?.email );
  }

  private filtrarPorEspecialista( turnos : Turn[] ) {
    return turnos.filter( (turno) => turno.especialista === this.specialist?.email );
  }
}

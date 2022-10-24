import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Turn } from 'src/app/models/Turn/turn';

@Injectable({
  providedIn: 'root'
})
export class TurnService {
  private collection : string = "turns";

  constructor(
    private db : AngularFirestore
  ) { }

  addTurn ( turno : Turn ) {
    return this.db.collection( this.collection ).add( {...turno} );
  }

  updateTurn ( turno : any ) {
    return this.db.collection( this.collection ).doc( turno.id ).update ( {...turno} );
  }

  async checkForTurnOnSchedule ( especialista : string, fecha : string ) {
    const turnos = await this.getBySpecialist( especialista );
    if ( turnos.length === 0 ) return 
    const MIN30 = (30*60*1000);
    const fechaParsed = Date.parse( fecha );
    const fechaMinus30Min = fechaParsed - MIN30;
    const fechaPlus30Min = fechaParsed + MIN30; 
    
    return turnos.filter( (turno : any) => {
      const fechaOfTurnoParsed = Date.parse( turno.fecha );
      
      return (  (fechaOfTurnoParsed > fechaMinus30Min && 
            fechaOfTurnoParsed < fechaPlus30Min ||
            fechaOfTurnoParsed === fechaParsed) && 
            !turno.cancelado ) 
    } );
  }

  getAll () {
    return this.db.collection( this.collection )
            .get()
            .toPromise()
            .then( (querySnapshot) => querySnapshot?.docs )
            .then( (docs) => docs?.map( (doc) => {
              const ret : any = doc.data();
              ret.id = doc.id;
              return ret;
            } ) );
  }

  getByPatient ( paciente? : string ) {
    return this.db.collection( this.collection ).ref.where( "paciente", "==", paciente )
            .get()
            .then( snapshots => snapshots.docs.map( doc => {
              const ret : any = doc.data();
              ret.id = doc.id;
              return ret;
            } ) ); 
  }

  getBySpecialist ( especialista? : string ) {
    return this.db.collection( this.collection ).ref.where( "especialista", "==", especialista )
            .get()
            .then( snapshots => snapshots.docs.map( doc => {
              const ret : any = doc.data();
              ret.id = doc.id;
              return ret;
            } ) );
  }

  getByBoth ( especialista : string, paciente : string ) {
    return this.db.collection( this.collection ).ref
            .where( 'especialista', '==', especialista )
            .get()
            .then( snapshots => snapshots.docs.map( doc => {
              const ret : any = doc.data();
              ret.id = doc.id;
              return ret;
            } ) )
            .then( turnos => turnos.filter( (turno) => turno.paciente === paciente ) );
  }

  getByField ( campo : string, valor : string|number ) {
    return this.db.collection( this.collection ).ref.where( campo, "==", valor )
            .get()
            .then( snapshots => snapshots.docs.map( doc => {
              const ret : any = doc.data();
              ret.id = doc.id;
              return ret;
            } ) );
  }

  async getCountByDays () {
    const turnos: any = await this.getAll();

    return this.ordenarTurnosPorFecha(turnos);
  }

  async getCantidadTurnosPorMedicoEntre ( fechaMin : string, fechaMax : string, finalizado? : boolean ) {
    let turnos: any = await this.getAll();
    fechaMin += "T00:00";
    fechaMax += "T23:59";
    
    if ( finalizado ) turnos = turnos.filter( (turnos: any) => turnos.finalizado == finalizado );
    
    const turnosFiltrados = this.filterTurnoEntreFechas( turnos, fechaMin, fechaMax );
    return this.ordenarTurnosPorFecha(turnosFiltrados);
  }

  filterTurnoEntreFechas( turnos : any[], fechaMin : string, fechaMax : string ) {
    const fechaParsedMin = Date.parse( fechaMin );
    const fechaParsedMax = Date.parse( fechaMax );
    
    return turnos.filter( (turno : any) => {
      const fechaOfTurnoParsed = Date.parse( turno.fecha );
      
      return (  (fechaOfTurnoParsed > fechaParsedMin && 
            fechaOfTurnoParsed < fechaParsedMax ) && 
            !turno.cancelado ) 
    } );

  }

  ordenarTurnosPorFecha( turnos : any[] ) {
    const turnosPorFecha : any = {};

    turnos.forEach( (turno) => turno.fecha = turno.fecha.substring( 0, turno.fecha.indexOf('T') ) );
    
    turnos.forEach( (turno) => {
      if ( !(turno.fecha in turnosPorFecha) ) turnosPorFecha[turno.fecha] = [];
      
      turnosPorFecha[turno.fecha].push( turno );
    } );
    
    for ( let fecha in turnosPorFecha ) {
      turnosPorFecha[fecha] = turnosPorFecha[fecha].length;
    }
    return turnosPorFecha;
  }
}

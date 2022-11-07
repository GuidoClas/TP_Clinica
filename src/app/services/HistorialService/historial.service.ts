import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private collection : string = "turns";

  constructor(
    private db : AngularFirestore
  ) { }

  addHistorial ( turnoId? : string, historia? : any ) {
    if ( !turnoId || !historia ) return

    return this.db.collection( this.collection ).doc( turnoId ).update({ historia });
  }

  getHistorial ( turnoId? : string ) {
    if ( !turnoId ) return

    return this.db.collection( this.collection ).doc( turnoId )
      .get()
      .toPromise()
      .then( (document) => document?.data() )
      .then( (data : any) => data.historia );
  }
}

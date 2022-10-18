import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';
import { Specialtie } from 'src/app/models/Specialties/specialties';

@Injectable({
  providedIn: 'root'
})
export class SpecialtiesService {

  private collection : string = "specialties";

  constructor(
    private db : AngularFirestore
  ) { }

  async getSpecialties () {
    return (await (firstValueFrom(this.db.collection(this.collection).get()))).docs.map( especialidad =>
      new Specialtie( especialidad.id , (especialidad.data() as any).tipo, (especialidad.data() as any).imagenURL )
    );
  }

  addSpecialties( specialtie : string  ) {
    return this.db.collection(this.collection).add( {tipo: specialtie} );
  }

  getSpecialtie ( specialtie : string ) {
    return this.db.collection( this.collection )
                    .ref
                    .where( "tipo", "==", specialtie )
                    .get()
                    .then( (snapshots) => snapshots.docs )
                    .then( (docs) => docs.map( (doc) => doc.data() ) )
                    .then( (data : any) => data.tipo );
  }
}

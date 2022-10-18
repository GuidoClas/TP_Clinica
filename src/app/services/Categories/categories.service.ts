import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';
import { Category } from 'src/app/models/Category/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private collection : string = "cats";

  constructor(
    private db : AngularFirestore
  ) { }

  async getCategorias () {
    return (await (firstValueFrom(this.db.collection<Category>(this.collection).get()))).docs.map( categoria => categoria.data() as Category );
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Category } from 'src/app/models/Category/category';
import { Specialtie } from 'src/app/models/Specialties/specialties';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { CategoriesService } from 'src/app/services/Categories/categories.service';
import { SpecialtiesService } from 'src/app/services/Specialties/specialties.service';
import { StorageService } from 'src/app/services/Storage/storage.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  public readonly EDAD_MAXIMA = 120;
  public readonly EDAD_MINIMA = 18;

  public form : FormGroup;
  public token? : string = undefined;

  public mensajeRegistro : string = "";
  public mensajeErrorRegistro : string = "";
  public habilitarBoton : boolean = false;

  private imagenUnoUrl? : string = undefined;


  constructor(
    private formBuilder : FormBuilder,
    private storageService: StorageService,
    private AuthService : AuthService,
  ) {
    this.form = this.formBuilder.group({
      nombre: [null, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      apellido: [null, [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      edad: [null, [Validators.required, Validators.min(this.EDAD_MINIMA), Validators.max(this.EDAD_MAXIMA)]],
      dni: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      email: [null, [Validators.required, Validators.email]],
      contrasenia: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/i), Validators.minLength(6)]],
      imagenUno: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
  }  

  isRequiredField(field: string) {
    const form_field = this.form.get(field);
    if (form_field === null || form_field === undefined || !form_field.validator) {
        return false;
    }

    const validator = form_field.validator({} as AbstractControl);
    return (validator && validator.required);
  }

  subirArchivoUno ( event : any ) {
    const email = this.form.controls.email.value;
    const imagenUno : File = event.target.files[0];
    const imagenUnoNombre = email + "_1";

    const tareaImagenUno = this.storageService.tareaCloudStorage( imagenUnoNombre, imagenUno );
    tareaImagenUno.then( (termino : any) => termino.ref.getDownloadURL().then( (URL: any) => {
      this.imagenUnoUrl = URL;
      this.habilitarBoton = true;
    } ) );
  }
  
  onSubmit ( event : Event ) {
    this.registro();
  }

  private registro() {
    const razon = "0";
    const nombre = this.form.controls.nombre.value;
    const apellido = this.form.controls.apellido.value;
    const edad = this.form.controls.edad.value;
    const dni = this.form.controls.dni.value;
    const email = this.form.controls.email.value;
    const contrasenia = this.form.controls.contrasenia.value;
    const imagenUno = this.imagenUnoUrl;

    const usuario = new Usuario();
    usuario.razon = razon;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.edad = edad;
    usuario.dni = dni;
    usuario.email = email;
    usuario.contrasenia = contrasenia;
    usuario.imagenUnoUrl = imagenUno;
    
    this.AuthService.register( usuario )
      .then( () => {
        this.mensajeRegistro = "Administrador registrado!";
        this.form.reset();
      } )
      .catch( (error: any) => {this.mensajeErrorRegistro = "¡Error al registrar usuario!"; console.error(error)} );
    }

}

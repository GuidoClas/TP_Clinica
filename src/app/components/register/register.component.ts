import { trigger, state, style, transition, animate } from '@angular/animations';
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('openClose', [

      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0
      })),
      transition('open => closed', [
        animate('3s linear')
      ]),
      transition('closed => open', [
        animate('3s linear')
      ]),
    ]),
  ]
})
export class RegisterComponent implements OnInit {
  public readonly EDAD_MAXIMA = 120;
  public readonly EDAD_MINIMA = 18;

  public form : FormGroup;
  public token? : string = undefined;

  public cats : Category[] = [];
  public specialties : Specialtie[] = [];
  public mensajeRegistro : string = "";
  public mensajeErrorRegistro : string = "";
  public habilitarBoton : boolean = false;
  public mostrarFullScreen : boolean = true;

  private imagenUnoUrl? : string = undefined;
  private imagenDosUrl? : string = undefined;


  constructor(
    private formBuilder : FormBuilder,
    private storageService: StorageService,
    private AuthService : AuthService,
    private specialtiesService: SpecialtiesService,
    private catsService: CategoriesService
  ) {
    this.form = this.formBuilder.group({
      razon: [null, [Validators.required]],
      especialidad: [null, [Validators.required]],
      nombre: [null, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      apellido: [null, [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      edad: [null, [Validators.required, Validators.min(this.EDAD_MINIMA), Validators.max(this.EDAD_MAXIMA)]],
      dni: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      obraSocial: [null, [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: [null, [Validators.required, Validators.email]],
      contrasenia: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/i), Validators.minLength(6)]],
      imagenUno: [null, [Validators.required]],
      imagenDos: [null, [Validators.required]],
      especialidadNueva: [null],
      captcha: [null, [Validators.required]]
    });
    this.setValidatorsSegunEspecialidad();
    this.form.controls.captcha.valueChanges.subscribe( (token) => {
      this.token = token
    } );
  }

  elegirRazon ( razonId : string ) {
    this.form.controls.razon.setValue( razonId );
    this.mostrarFullScreen = false;
  }

  async ngOnInit() {
    this.cats = await this.catsService.getCategorias();
    this.cats = this.cats.filter( categoria => categoria.id !== 0 );
    this.specialties = await this.specialtiesService.getSpecialties();
  }  

  isRequiredField(field: string) {
    const form_field = this.form.get(field);
    if (form_field === null || form_field === undefined || !form_field.validator) {
        return false;
    }

    const validator = form_field.validator({} as AbstractControl);
    return (validator && validator.required);
  }

  setValidatorsSegunEspecialidad() {
    this.form.controls.razon.valueChanges.subscribe( razonId => {
      if ( razonId === "1" /* ESPECIALISTA */ ) {
        this.form.controls.obraSocial.setValidators(null);
        this.form.controls.imagenDos.setValidators(null);
        this.form.controls.especialidad.setValidators( [Validators.required] );
      }

      if ( razonId === "2" /* PACIENTE */ ) {
        this.form.controls.obraSocial.setValidators([Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]);
        this.form.controls.imagenDos.setValidators([Validators.required]);
        this.form.controls.especialidad.setValidators(null);
      }
      this.form.controls.imagenDos.updateValueAndValidity();
      this.form.controls.obraSocial.updateValueAndValidity();
      this.form.controls.especialidad.updateValueAndValidity();
    });
  }

  subirArchivoUno ( event : any ) {
    const email = this.form.controls.email.value;
    const imagenUno : File = event.target.files[0];
    const imagenUnoNombre = email + "_1";

    const tareaImagenUno = this.storageService.tareaCloudStorage( imagenUnoNombre, imagenUno );
    tareaImagenUno.then( (termino : any) => termino.ref.getDownloadURL().then( (URL: any) => {
      this.imagenUnoUrl = URL;
      
      if ( !this.isRequiredField('imagenDos') ){
        this.habilitarBoton = true;
      }

      if ( this.isRequiredField('imagenDos') && this.imagenDosUrl )
        this.habilitarBoton = true;

    } ) );
  }

  subirArchivoDos ( event : any ) {
    const email = this.form.controls.email.value;
    const razon = this.form.controls.razon.value;
    const imagenDos : File = event.target.files[0];
    const imagenDosNombre = email + "_2";

    if ( razon === "2" /* PACIENTE */ ) {
      const tareaImagenDos = this.storageService.tareaCloudStorage( imagenDosNombre, imagenDos );
      tareaImagenDos.then( (termino: any) => termino.ref.getDownloadURL().then( (URL: any) => {
        this.imagenDosUrl = URL;

        if ( this.imagenUnoUrl )
          this.habilitarBoton = true;

      } ) );
    }
  }
  
  onSubmit ( event : Event ) {
    this.registro();
  }

  private registro() {
    const razon = this.form.controls.razon.value;
    let especialidad = this.form.controls.especialidad.value;
    const nombre = this.form.controls.nombre.value;
    const apellido = this.form.controls.apellido.value;
    const edad = this.form.controls.edad.value;
    const dni = this.form.controls.dni.value;
    const obraSocial = this.form.controls.obraSocial.value;
    const email = this.form.controls.email.value;
    const contrasenia = this.form.controls.contrasenia.value;
    const especialidadNueva = this.form.controls.especialidadNueva.value;
    const imagenUno = this.imagenUnoUrl;
    const imagenDos = this.imagenDosUrl;

    const usuario = new Usuario();
    usuario.razon = razon;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.edad = edad;
    usuario.dni = dni;
    usuario.email = email;
    usuario.contrasenia = contrasenia;
    usuario.imagenUnoUrl = imagenUno;

    if ( razon === "1" /* ESPECIALISTA */ ) {
      if ( especialidad == null || especialidad == undefined || especialidad == ""  ) usuario.especialidad = especialidadNueva;
      else usuario.especialidad = especialidad;
      usuario.aprobado = false;
    }
    
    if ( razon === "2" /* PACIENTE */ ) {
      usuario.obraSocial = obraSocial;
      usuario.imagenDosUrl = imagenDos;
    }
    
    this.AuthService.register( usuario )
      .then( () => {
        this.mensajeRegistro = "USUARIO REGISTRADO!";
        this.form.reset();
        if ( !this.AuthService.login( usuario ) ) {
          this.mensajeRegistro = "USUARIO REGISTRADO, NO SE PUEDE INICIAR SESIÓN HASTA QUE ESTÉ APROBADO.";
        }
      } )
      .catch( (error: any) => {this.mensajeErrorRegistro = "ERROR AL REGISTRAR USUARIO!"; console.error(error)} );

    if ( especialidadNueva != null ) {
      this.specialtiesService.addSpecialties(especialidadNueva).then( () => console.log("Especialidad Agregada!!") );
    }

  }

  nuevaEspecialidad( nueva : string ) {
    if ( nueva != "" ) {
      this.form.controls.especialidad.setValidators(null);
      this.form.controls.especialidad.disable();
    }
  }

  especalidad( especialidad : string ) {
    this.form.controls.especialidadNueva.disable();
  }

}

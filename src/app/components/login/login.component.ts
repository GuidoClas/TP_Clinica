import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public mostrarUsuarios : boolean = false;
  public usuariosCargados : boolean = false;

  public admins : any[] = [];
  public especialistas : any[] = [];
  public pacientes : any[] = [];

  title: string = "Ingresar";

  button_title: string = "Iniciar Sesion";

  errorInicioDeSesion : string = "";

  loginCuentaForm!: FormGroup;

  constructor(
    private AuthService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {

    this.loginCuentaForm = new FormGroup({
      email: new FormControl(
        '',
        [Validators.required, Validators.email]
      ),
      password: new FormControl(
        '',
        [Validators.required, Validators.maxLength(15), Validators.minLength(5)]
      )
    });
    
    this.AuthService.errorInicioDeSesion
      .subscribe( (mensaje: string) => {
        this.errorInicioDeSesion = mensaje;
      } );

    
    this.admins = (await this.AuthService.getAdmins()).slice(0, 2);
    this.especialistas = (await this.AuthService.getEspecialistas()).slice(0, 2);
    this.pacientes = (await this.AuthService.getPacientes()).slice(0, 3);
    this.usuariosCargados = true;
  }

  async onSubmit() {

    if (!this.loginCuentaForm.valid) return;

    const email = this.loginCuentaForm.value.email;
    const contrasenia = this.loginCuentaForm.value.password;

    const usuario = new Usuario();

    usuario.email = email;
    usuario.contrasenia = contrasenia;

    const isSuccess = await this.AuthService.login(usuario);
    
    isSuccess ? this.router.navigate(['/home']) : this.errorInicioDeSesion = "Su perfil no fue aprobado todavía";
  }

  onSeleccionarParaInicioRapido ( usuario : any ) {
    this.loginCuentaForm.patchValue({
      email: usuario.email,
      password: usuario.contrasenia
    });
    this.onSubmit();
  }

}
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public usuarios : any[] = [];
  public actualizado : boolean = false;

  public isAdmin : boolean = false;
  public paciente? : Usuario;

  constructor( private AuthService: AuthService ) { }

  async ngOnInit(): Promise<void> {
    this.usuarios = await this.AuthService.getEspecialistas();
    this.isAdmin = true;
  }

  onApproval ( usuario : Usuario, event : any ) {
    usuario.aprobado = event.target.checked;
    this.AuthService.actualizarUsuario(usuario).then( () => this.actualizado = true );
  }

}

import { Component, OnInit } from '@angular/core';
import { Turn } from 'src/app/models/Turn/turn';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { PDFService } from 'src/app/services/PDFService/pdf.service';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public user? : Usuario;
  public usuarios? : any[] = [];
  public actualizado : boolean = false;

  public isAdmin : boolean = false;
  public isSpecialistFilter : boolean = true;
  public paciente? : Usuario;

  constructor( private AuthService: AuthService, private turnService: TurnService, private pdfService: PDFService ) {
    this.user = this.AuthService.userLogged;
  }

  async ngOnInit(): Promise<void> {
    this.usuarios = await this.AuthService.getEspecialistas();
    this.isAdmin = true;  
  }

  onApproval ( usuario : Usuario, event : any ) {
    usuario.aprobado = event.target.checked;
    this.AuthService.actualizarUsuario(usuario).then( () => this.actualizado = true );
  }

  async onFilterUsers(){
    this.isSpecialistFilter = !this.isSpecialistFilter;
    if(!this.isSpecialistFilter){
      this.usuarios = undefined;
      this.usuarios = await this.AuthService.getPacientes();
    } else {
      this.usuarios = undefined;
      this.usuarios = await this.AuthService.getEspecialistas();
    }
  }

  async downloadHistorial(user : Usuario){
    const nombreDoc = user.email + ".pdf";
    const turnos = await this.turnService.getByPatient( user.email );
    const historias = this.splitClinicHistories( turnos );
    this.pdfService.createTablePDF( nombreDoc, historias );
    return
  }

  splitClinicHistories ( turnos : Turn[] ) {
    return turnos
            .filter( (turno) => turno.finalizado != undefined && turno.finalizado && turno.historia != undefined )
            .map( (turno) => turno.historia );
  }

}

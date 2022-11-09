import { Component, OnInit } from '@angular/core';
import { Turn } from 'src/app/models/Turn/turn';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { PDFService } from 'src/app/services/PDFService/pdf.service';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  public user? : Usuario;
  public usuarios? : any[] = [];

  constructor( private AuthService: AuthService, private turnService: TurnService, private pdfService: PDFService ) {
    this.user = this.AuthService.userLogged;
  }

  async ngOnInit(): Promise<void> {
    this.usuarios = await this.AuthService.getUsuariosAtendidosPorEspecialista(this.user?.email!);
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

import { Component, OnInit } from '@angular/core';
import { Turn } from 'src/app/models/Turn/turn';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { PDFService } from 'src/app/services/PDFService/pdf.service';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user : any;
  public patients : any[] = [];
  public chosenPatient : any;
  public specialists : any[] = [];

  public horarioMin : string = "";
  public horarioMax : string = "";

  public message : string = "";

  constructor(
    private AuthService : AuthService,
    private turnService : TurnService,
    private pdfService: PDFService
  ) { 
    this.user = this.AuthService.userLogged;
  }

  ngOnInit() { }
  
  actualizarHorario() {
    this.message = "";
    this.user.horarioMin = this.horarioMin;
    this.user.horarioMax = this.horarioMax;
    this.AuthService.actualizarUsuario( this.user ).then( () => this.message = "¡Horario Actualizado!" );
  }

  async downloadClinicHistorial() {
    const nombreDoc = this.user.email + ".pdf";
    const turnos = await this.turnService.getByPatient( this.user.email );
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

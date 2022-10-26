import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/Auth/auth.service';
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
    private turnService : TurnService
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
}

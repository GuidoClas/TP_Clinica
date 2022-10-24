import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Specialtie } from 'src/app/models/Specialties/specialties';
import { Turn } from 'src/app/models/Turn/turn';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { SpecialtiesService } from 'src/app/services/Specialties/specialties.service';
import { TurnService } from 'src/app/services/TurnService/turn.service';

@Component({
  selector: 'app-turn-application',
  templateUrl: './turn-application.component.html',
  styleUrls: ['./turn-application.component.css']
})
export class TurnApplicationComponent implements OnInit {

  public iniciado? : Usuario;
  public pacientes : any[] = [];
  public paciente? : Usuario;

  public dia : string = "";
  public horario : string = "";

  public especialista : any;
  public especialidades : Specialtie[] = [];
  public especialistas : any[] = [];
  public dias : string[] = [];
  public horarios : string[] = [];

  public paso0: boolean = true;
  public paso1: boolean = false;
  public paso2: boolean = false;
  public paso3: boolean = false;

  constructor(
    private specialtiesService : SpecialtiesService,
    private authService : AuthService,
    private turnService: TurnService,
    private router : Router
  ) {
    this.iniciado = this.authService.userLogged;
  }

  async ngOnInit() {
    this.especialidades = await this.specialtiesService.getSpecialties();

    if ( this.iniciado?.razon === "0" ){
      this.pacientes = await this.authService.getPacientes();
      return
    }

    this.paciente = this.iniciado;
  }

  elegirEspecialidad( especialidad? : string ) {
    this.horario = "";
    this.dias = [];
    this.dia = "";
    this.especialista = undefined;

    this.traerEspecialistas( especialidad );
    this.paso0 = false;
    this.paso1 = true;
  }

  elegirEspecialista( especialista : any ) {
    this.horario = "";
    this.dias = []
    this.dia = "";
    this.especialista = especialista;
    
    const currentDate = new Date();
    let dias = this.filterDays( this.getWeekdaysInMonth( currentDate.getMonth(), currentDate.getFullYear() ) );
    this.dias = this.estilizarDias( dias );

    this.paso1 = false;
    this.paso2 = true;
  }

  async elegirDia ( dia : string ) {
    this.dia = dia;
    this.horario = "";
    this.horarios = [];
    this.obtenerHorarios( this.especialista.horarioMin, this.especialista.horarioMax ); 
    this.horarios = await this.filtrarHorarios(dia);

    this.paso2 = false;
    this.paso3 = true;
  }

  elegirHorario ( horario : string ) {
    this.horario = this.dia + "T" + horario;
    this.paso3 = false;
  }

  solicitarTurno() {
    const turno = new Turn();
    turno.paciente = this.paciente?.email;
    turno.especialidad = this.especialista.especialidad;
    turno.especialista = this.especialista.email;
    turno.fecha = this.horario;
    this.turnService.addTurn( turno ).then( () =>  this.router.navigateByUrl( "/home" ) );
  }

  setPaciente( paciente : Usuario ) {
    this.paciente = paciente;
  }

  private async traerEspecialistas ( especialidad? : string ) {
    if ( !especialidad ) return

    this.especialistas = await this.authService.getEspecialistasPorEspecialidad( especialidad );
  }

  private async filtrarHorarios( dia : string ) {
    const horarios : string[] = [];
    console.log("HASTA ACA");
    this.horarios.forEach( async (horario) => {
        const disponibilidad = (await this.chequearDisponibilidadFecha( dia + "T" + horario ));
        if ( disponibilidad ) horarios.push(horario);
    } )
    return horarios;
  }

  public async chequearDisponibilidadFecha ( fecha : string ) {
    const turnos = ( await this.turnService.checkForTurnOnSchedule( this.especialista.email, fecha ) );
    return (turnos === undefined || turnos.length === 0);
  }

  private estilizarDias ( days : number[] ) : string[] {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return days.map( (day) => year + "-" + ( ( month < 10) ? "0" + month : month ) + "-" + ((day < 10) ? "0" + day : day) );
  }

  private filterDays( days : number[] ) : number[] {
    const currentDay = (new Date()).getDate();
    return days.filter( (number) => number > currentDay);
  }

  private getWeekdaysInMonth(month : number, year : number) : number[] {
    let days = this.daysInMonth(month, year);
    const weekdays = [];
    for(var i=0; i< days; i++) {
        if (this.isWeekday(year, month, i+1)) weekdays.push( i+1 );
    }
    return weekdays;
  }

  private daysInMonth(iMonth : number, iYear : number) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  private isWeekday(year : number, month : number, day : number) {
    let onlyDay = new Date(year, month, day).getDay();
    return onlyDay !=0 && onlyDay !=6;
  }

  private async obtenerHorarios ( horarioMin = "7:00", horarioMax = "18:00") {
    const horarioMinSplitted = horarioMin.split(':');
    const horarioMaxSplitted = horarioMax.split(':');
    //const horarioMinSplitted = ['8', '15'];
    //const horarioMaxSplitted = ['12', '15'];

    let hora = parseInt( horarioMinSplitted[0] );
    let minuto = parseInt( horarioMinSplitted[1] );

    const horaMax = parseInt( horarioMaxSplitted[0] );
    const minutoMax = parseInt( horarioMaxSplitted[1] );

    while( hora <= horaMax ) {
      console.log("entra WHILE");
      if ( hora === horaMax && minuto >= minutoMax ) break;
      const horario = ( (hora < 10) ? '0' + hora : hora ) + ":" + ( (minuto == 0) ? '00' : minuto );
      this.horarios.push( horario );
      
      if ( minuto === 30 ){
        hora++;
        minuto = 0;
        continue;
      }

      if ( minuto === 0 ) 
        minuto = 30;
    } 
    
  }
}

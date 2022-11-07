import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { HistorialService } from 'src/app/services/HistorialService/historial.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Input() public idTurno : string = "";

  public user? : Usuario;

  public readonly ALTURA_MINIMA : number = 0;
  public readonly ALTURA_MAXIMA : number = 300;
  public readonly PESO_MINIMO : number = 0;
  public readonly PESO_MAXIMO : number = 400;
  public readonly TEMPERATURA_MINIMA : number = 25;
  public readonly TEMPERATURA_MAXIMA : number = 60;
  public readonly PRESION_MINIMA : number = 0;
  public readonly PRESION_MAXIMA : number = 500;

  public form : FormGroup;

  constructor(
    private formBuilder : FormBuilder,
    private AuthService : AuthService,
    private historialService : HistorialService
  ) {
    this.user = this.AuthService.userLogged;
    this.form = this.formBuilder.group( {
      altura: [null, [Validators.required, Validators.min(this.ALTURA_MINIMA), Validators.max(this.ALTURA_MAXIMA), Validators.pattern(/^\d+$/)]],
      peso: [null, [Validators.required, Validators.min(this.PESO_MINIMO), Validators.max(this.PESO_MAXIMO), Validators.pattern(/^\d+$/)]],
      temperatura: [null, [Validators.required, Validators.min(this.TEMPERATURA_MINIMA), Validators.max(this.TEMPERATURA_MAXIMA), Validators.pattern(/^\d+$/)]],
      presion : [null, [Validators.required, Validators.min(this.PRESION_MINIMA), Validators.max(this.TEMPERATURA_MAXIMA), Validators.pattern(/^\d+$/)]],
      datoDinamicoUnoNombre: [""],
      datoDinamicoDosNombre: [""],
      datoDinamicoTresNombre: [""],
      datoDinamicoUnoValor: [""],
      datoDinamicoDosValor: [""],
      datoDinamicoTresValor: [""]
    } );
  }

  private async settearValores() {
    const historia : any = await this.historialService.getHistorial( this.idTurno );

    if ( !historia ) return
        
    this.form.controls.altura.setValue( historia.altura );
    this.form.controls.temperatura.setValue( historia.peso );
    this.form.controls.peso.setValue( historia.temperatura );
    this.form.controls.presion.setValue( historia.presion );

    this.form.controls.datoDinamicoUnoNombre.setValue( historia.datoDinamicoUnoNombre );
    this.form.controls.datoDinamicoUnoValor.setValue( historia.datoDinamicoUnoValor );
    this.form.controls.datoDinamicoDosNombre.setValue( historia.datoDinamicoDosNombre );
    this.form.controls.datoDinamicoDosValor.setValue( historia.datoDinamicoDosValor );
    this.form.controls.datoDinamicoTresNombre.setValue( historia.datoDinamicoTresNombre );
    this.form.controls.datoDinamicoTresValor.setValue( historia.datoDinamicoTresValor );
    
    if(this.user?.razon === '2'){
      this.deshabilitarForm();
    }
  }

  private deshabilitarForm() {
    this.form.disable();
  }

  ngOnInit(): void {
    this.settearValores();
  }

  submitHistoriaClinica(event : any) {
    if ( !this.idTurno || !this.form.valid  ) return

    const historia : any = {};
    historia.altura = this.form.controls.altura.value;
    historia.temperatura = this.form.controls.temperatura.value;
    historia.peso = this.form.controls.peso.value;
    historia.presion = this.form.controls.presion.value;

    this.agregarDatosDinamicos( historia );

    this.historialService.addHistorial( this.idTurno, historia )
    ?.then( () => this.deshabilitarForm() )
  }

  private agregarDatosDinamicos ( historia : any ) {
    let labelOne = this.form.controls.datoDinamicoUnoNombre.value;
    let labelTwo = this.form.controls.datoDinamicoDosNombre.value;
    let labelThree = this.form.controls.datoDinamicoTresNombre.value;
    
    historia[labelOne] = this.form.controls.datoDinamicoUnoValor.value;
    historia[labelTwo] = this.form.controls.datoDinamicoDosValor.value;
    historia[labelThree] = this.form.controls.datoDinamicoTresValor.value;
  }
}

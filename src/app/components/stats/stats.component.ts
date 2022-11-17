import { Component, OnInit } from '@angular/core';
import { ChartDataset } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { ExcelService } from 'src/app/services/ExcelService/excel.service';
import { SpecialtiesService } from 'src/app/services/Specialties/specialties.service';
import { TurnService } from 'src/app/services/TurnService/turn.service';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  public lineChartDataTurnosXCategoria? : ChartDataset[]; 
  public lineChartLabelsTurnosXCategoria?: any[];

  public lineChartDataTurnosXMedicoSF? : ChartDataset[];
  public lineChartLabelsTurnosXMedicoSF? : any[];

  public lineChartDataTurnosXMedicoF? : ChartDataset[];
  public lineChartLabelsTurnosXMedicoF? : any[];

  public lineChartDataTurnosPorDia? : ChartDataset[];
  public lineChartLabelsTurnosPordia? : any[];

  public xAxisCategoriesTurnosXDia : string[] = [];
  public series : any = {};

  public fechasTurnos : string[] = [];
  public fechasMaxTurnos : string[] = [];

  public diasTurnos : string[] = [];

  public logs : any[] = [];

  public fechaMin : string = "";
  public fechaMax : string = "";

  public counter: number = 0;

  constructor(
    private especialidadService : SpecialtiesService,
    private turnoService : TurnService,
    private excelService : ExcelService,
    private authService : AuthService
  ) {}

  async ngOnInit() {
    const categorias = await this.especialidadService.getSpecialties();
    const dataTurnos = []
    const lineChartLabels = [];
    
    for ( let categoria of categorias ){

      if( !categoria.tipo  || !categoria.id ) continue
      lineChartLabels.push( categoria.tipo );
      dataTurnos.push ( (await this.turnoService.getByField( 'especialidad', categoria.tipo  )).length );
    }

    const lineChartData = [{
      data: dataTurnos,
      label: 'Cantidad de Turnos Por Especialidad',
      borderColor: '#36A2EB',
      backgroundColor: '#ffc107',
    }];

    this.lineChartLabelsTurnosXCategoria = lineChartLabels;
    this.lineChartDataTurnosXCategoria = lineChartData;
    
    const cantTurnosXDias = await this.turnoService.getCountByDays();
    const dataTurnosXDias : number[] = Object.values( cantTurnosXDias );
    const labelTurnosXDias : string[] = Object.keys( cantTurnosXDias );
  
    this.lineChartLabelsTurnosPordia = labelTurnosXDias;
    this.lineChartDataTurnosPorDia = [{
      data: dataTurnosXDias,
      label: "Turnos por día",
      borderColor: '#FF0000',
      backgroundColor: '#ffc107',
    }];
    

    this.series = [{
      data: dataTurnosXDias,
      name: 'Cantidad de Turnos Por Dias'
    }]
    this.xAxisCategoriesTurnosXDia = labelTurnosXDias;
    const logs = (await this.authService.getLogs());

    logs?.forEach( (log : any) => {
      const date = log.hora.toDate();
      const fecha = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
      const hora = date.getHours() + ":" + date.getMinutes();
      const usuario = log.email;

      this.logs.push( {fecha, hora, usuario} );
    } );

    this.diasTurnos = Object.keys( cantTurnosXDias );
  }

  seleccionarFechaMinima( fechaMin : string ) {
    this.fechaMin = fechaMin;
    this.fechasMaxTurnos = this.filtrarFechasMax( fechaMin );
    this.fechaMax = "";
    this.lineChartDataTurnosXMedicoF = undefined;
    this.lineChartLabelsTurnosXMedicoF = undefined;
    this.lineChartDataTurnosXMedicoSF = undefined;
    this.lineChartDataTurnosXMedicoSF = undefined;
  }

  private filtrarFechasMax( fechaMin : string ) {
    const arrSplittedFechas = this.diasTurnos.map( (fecha) => fecha.split( ("-") ) ).map( (fechaSplitted) => fechaSplitted.map( (valor) => parseInt(valor) ) );
    const splittedFechaMin = fechaMin.split("-").map( (valor) => parseInt(valor) );
    
    const ordenados = arrSplittedFechas.filter( (fechaSplitted) => fechaSplitted[0] >= splittedFechaMin[0] ||
                                                          (fechaSplitted[1] >= splittedFechaMin[1] &&
                                                          fechaSplitted[2] > splittedFechaMin[2]) );
    return ordenados.map( (valores) => valores.join("-") );
  }

  async seleccionarFechaMaxima( fechaMax : string ) {
    this.fechaMax = fechaMax;

    const turnosSinFinalizar = await this.turnoService.getCantidadTurnosPorMedicoEntre( this.fechaMin, this.fechaMax );
    const turnosFinalizados = await this.turnoService.getCantidadTurnosPorMedicoEntre( this.fechaMin, this.fechaMax, true );
    
    const dataTurnosSinFinalizar : number[] = Object.values( turnosSinFinalizar );
    const labelTurnosSinFinalizar : any[] = Object.keys( turnosSinFinalizar );
    this.lineChartLabelsTurnosXMedicoSF = labelTurnosSinFinalizar;
    this.lineChartDataTurnosXMedicoSF = [{
      data: dataTurnosSinFinalizar,
      label: 'Cantidad de Turnos Por Medico entre ' + this.fechaMin + " " + this.fechaMax + " sin finalizar"
    }];

    const dataTurnosFinalizados : number[] = Object.values( turnosFinalizados );
    const labelTurnosFinalizados : any[] = Object.keys( turnosFinalizados );
    this.lineChartLabelsTurnosXMedicoF = labelTurnosFinalizados;
    this.lineChartDataTurnosXMedicoF = [{
      data: dataTurnosFinalizados,
      label: 'Cantidad de Turnos Por Medico entre ' + this.fechaMin + " " + this.fechaMax + " finalizados"
    }];
  }

  descargarPDF( id : string, nombre : string ) {
     // printDiv is the html element which has to be converted to PDF
    const element = document.querySelector("#" + id) as HTMLElement;

    if( !element ) return

    html2canvas( element ).then((canvas : any) => {
      var pdfFile = new jsPDF('l', 'px', "a4");
      var imgData  = canvas.toDataURL("image/jpeg", 0.2);
      pdfFile.addImage(imgData,0,0, 700, canvas.height);
      pdfFile.save(nombre + '.pdf');
    });
     
  }
  
  async descargarExcel() {
    const blobFile = await this.excelService.generarExcel( this.logs.map( (log) => Object.values(log) ) );

    const url = window.URL.createObjectURL(blobFile);
    const anchor = document.createElement("a");
    anchor.download = "Logs" + ".xlsx";
    anchor.href = url;
    anchor.click();
  }

  setChart(count: number){
    if((this.counter + count ) < 0) {
      return;
    }
    if((this.counter + count ) > 2) {
      return;
    }
    this.counter += count;
  }

}

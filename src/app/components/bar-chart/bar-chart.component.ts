import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartDataset } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  
  @Input()lineChartData: ChartDataset[] = [];
  @Input()lineChartLabels: ChartDataset[] = [];
  @Input()type: any = "";
  public chart: any;

  lineChartOptions : any = {
    maintainAspectRatio: false,
    responsive: true,
    scales : {
        yAxes: [{
            ticks: {
            beginAtZero: true,
                stepValue: 1,
                steps: 10,
              max : 10,
            }
        }]
      }
  };

  constructor() { }

  ngOnInit(): void {
    this.createChart(this.type);
  }

  createChart(type: string){
    this.chart = new Chart(type, {
      type: 'bar', //this denotes tha type of chart
  
      data: {// values on X-Axis
        labels: this.lineChartLabels, 
        datasets: this.lineChartData
      },
      options: this.lineChartOptions
      
    });
  }

}
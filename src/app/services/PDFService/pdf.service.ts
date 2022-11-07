import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PDFService {

  constructor() { }

  createTablePDF ( nombre : string, data : any[] ) {
    const doc = new jsPDF( 'landscape', 'px', 'a3' );
    const image = new Image();
    image.src = "/assets/clinic-wp.jpg";
    const fecha = (new Date()).toLocaleString();
    doc.addImage( image, 'PNG', 10, 10, 50, 50 );
    doc.text( "Fecha Emisión: " + fecha, 80, 35 );
    doc.text( nombre.split('@')[0], 80, 55 );

    doc.table( 30, 100, data, Object.keys( data[0] ), { autoSize: false, margins: 30, fontSize: 42 } );
    doc.save( nombre );
  }
}

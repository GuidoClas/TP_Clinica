import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  async generarExcel( logs : any[] ) {
    const title = "Logs Usuarios";
    const header = ["Fecha", "Horario", "Usuario"]
    const data = logs;

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet( "Logs" );

    const titleRow = worksheet.addRow( [title] );
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.mergeCells('A1:C2');

    //Add Header Row
    let headerRow = worksheet.addRow(header);
    
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    worksheet.addRows(data);

    worksheet.columns.forEach( (column) => column.width = 50 );
    worksheet.eachRow( (row, number) => row.eachCell( (cell) => cell.alignment = { horizontal: 'center', vertical: 'middle' } ) );

    return await workbook.xlsx.writeBuffer()
              .then( (data) => new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } ) )
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseTime'
})
export class ParseTimePipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    const hora = parseInt(value.substring(0, 2))    
    return value + ' ' + ( (hora > 12) ? 'PM' : 'AM' );
  }

}

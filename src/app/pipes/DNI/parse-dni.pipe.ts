import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDNI'
})
export class ParseDNIPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    const decMill = value.substring( 0, 2 );
    const centMil = value.substring( 2, 5 );
    const cent = value.substring( 5, 8 );
    return decMill + '.' + centMil + '.' + cent;
  }

}

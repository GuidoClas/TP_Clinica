import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parsePassword'
})
export class ParsePasswordPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    return value.split('').map( value => "*" ).join('');
  }

}

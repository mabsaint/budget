import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rsort'
})
export class RsortPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return value.sort( (a, b) => a[args] <= b[args] ? 1 : -1);
    } else {
      return value;
    }
  }

}

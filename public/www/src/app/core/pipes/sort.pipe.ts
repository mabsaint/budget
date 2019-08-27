import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any[], args?: any): any {
    if (value) {
      return value.sort( (a, b) => a[args] >= b[args] ? 1 : -1);
    } else {
      return value;
    }
  }

}

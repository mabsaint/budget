import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(items: any[], attr: string, paid = false): any {
    if (!paid) {
      return items.filter(a => !a.paid ).reduce((a, b) => a + b[attr], 0);
    } else {
      return items.reduce((a, b) => a + b[attr], 0);
    }
  }

}

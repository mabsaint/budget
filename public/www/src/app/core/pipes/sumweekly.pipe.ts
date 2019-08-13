import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumweekly'
})
export class SumweeklyPipe implements PipeTransform {

  transform(items: any[], args?: number): any {
    return items.filter((e) => {
        return e.weeknumber === args && e.value < 0;
      }).reduce( (a, b) =>  a + b['value'] , 0);
  }

}

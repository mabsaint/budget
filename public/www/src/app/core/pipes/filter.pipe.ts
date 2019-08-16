import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: Array<any>, args?: Array<any>): any {
    console.log(args);
   if (!args) {
     return value;
   }
    return value.filter(e => {
      if (!e.category) {
        return true;
      }
      return e.category.indexOf(args) > -1
    });
    return value.filter(e => e.category.indexOf(args) > -1);
  }

}

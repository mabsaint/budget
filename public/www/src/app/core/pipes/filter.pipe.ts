import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: Array<any>, args?: Array<any>): any {

   if (!args) {
     return value;
   }
    return value.filter(e => {
      if (!e.category) {
        return true;
      }
      return e.category.toLowerCase().indexOf(args.toString().toLowerCase()) > -1;
    });
    return value.filter(e => e.category.indexOf(args) > -1);
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fmoment'
})
export class FmomentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment(value).format(args);
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: Array<any>, args?: String, paid?: boolean): any {

   if (!args || args.length < 2) {
     return value;
   }

   if (paid == null) {
    paid = false;
   }
    return value.filter(e => {
      if (!e.category) {
        return true;
      }
      let answer = true;
      const regex = /^([><=+-])(=?)(\d+)$/gm;
      const m = regex.exec(args.toString().toLowerCase());
      if (m !== null && m.length > 2) {
        const v = m[3] ? m[3] : m[2];

        switch (m[1]) {
          case '>' :
          answer = answer && (Math.abs(e.value) >= parseInt(v));
          break;
          case '<' :
            answer = answer && (Math.abs(e.value) <= parseInt(v));
            break;
            case '=' :
              answer = answer && (Math.abs(e.value) === parseInt(v));
              break;
            case '+' :
                answer = answer && (e.updated_at && moment(e.updated_at).isAfter(moment().add( parseInt(v), 'days')));
                break;
            case '-' :
                  answer = answer && (e.updated_at && moment(e.updated_at).isAfter(moment().add(-1* parseInt(v), 'days')));
                  break;
        }

      } else {
        answer =  e.category.toLowerCase().indexOf(args.toString().toLowerCase()) > -1 ||
        ( e.note && e.note.toLowerCase().indexOf(args.toString().toLowerCase()) > -1 );
      }


      return answer;
    });
    return value.filter(e => e.category.indexOf(args) > -1);
  }

}

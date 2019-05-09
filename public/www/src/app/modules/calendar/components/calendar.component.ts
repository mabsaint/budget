import {
  Component, OnInit, ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK
} from 'angular-calendar';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

import { Subject } from 'rxjs';
import { Entry } from "../../entries/models/entry";

import { EntryService } from '../../../services/entry.service';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import {BankAccount} from '../../account/account.model';

import * as moment from 'moment';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

moment.updateLocale('bg', {
  week: {
    dow: DAYS_OF_WEEK.MONDAY,
    doy: 0
  }
});

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events: Array<CalendarEvent<{ time: any }>>;
  view: string = CalendarView.Month;
  accounts:BankAccount[];

  get available() : number {
    let sum = 0;
    if(this.accounts)
    this.accounts.forEach(e => sum += e.value)
    return sum;
  }
  /* = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];
*/
  constructor(private entryService: EntryService) { }

  sum(events: any[], value: string) {
    let q = 0;
    events.forEach((e) => { e[value] ? q += e[value] : q += 0 });

    return q;
  }

  getTotalTillCurrent(current: Entry, list: Entry[]) {
    let value = this.available;
    console.log(value);
    let hasBase = list.find((e) => {
      return (e.date == current.date) && e.base;
    });
    let lastBase = list.sort( (a,b) => { return a.date >= b.date ? -1 : 1}).filter(e=>e.base && e.date <= current.date)
    //console.log(lastBase[0]);

    list.sort((a, b) => { return a.date >= b.date ? 1 : -1 });
    if(lastBase[0]) {
      value = lastBase[0].value;
      list = list.filter((a) => { return a.date >= lastBase[0].date && a.date <= current.date && !a.base });
    } else {
      list = list.filter((a) => { return (a.date <= current.date)  });
    }
    /*
    if(!hasBase)
      list = list.filter((a) => { return (a.date <= current.date)  });
    else
      list = list.filter((a) => { return a.date == current.date && !a.base });
*/
    // console.log(current.date + ":" + hasBase)
    // console.log(list);

     for (let i = 0; i < list.length; i++) {
      // console.log(current.date + ":" + list[i].value);
      value += list[i].value;

    }
   // console.log(value);
    return value;
  }

  loadEvents() {

    this.entryService.getAllEntries(true).subscribe((data: Array<Entry>) => {
      this.events = [];

      data.forEach(element => {

        this.events.push({
          start: new Date(element.date),
          //end: element.enddate,
          title: element.category + ' / ' + (element.note ? element.note : '') + ' ' + element.value,
          color: colors.yellow,
          allDay: true,
          value: element.value,
          total: this.getTotalTillCurrent(element, JSON.parse(JSON.stringify(data))),
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          id: element._id,
          cssClass: element.value > 0 ? 'egreen' : 'ered'
        },

        );
      });

       console.log(data);
    })
  }

  loadAccounts() {
    this.entryService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.loadEvents();
    })
  }

  ngOnInit() {
    this.loadAccounts();
  }

}

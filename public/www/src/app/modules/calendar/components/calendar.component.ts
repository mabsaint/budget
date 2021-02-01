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
import { Entry } from '../../entries/models/entry';

import { EntryService } from '../../../services/entry.service';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import {BankAccount} from '../../account/account.model';
import {appconfig} from './../../../configs/appconfig';

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
  snapshots: Array<any>;
  view: string = CalendarView.Month;
  accounts: BankAccount[];
  numberofsnapshots = 3;
  accountSubcription: any;
  currency = appconfig.currency;

  get available(): number {
    let sum = 0;
    if (this.accounts) {
      this.accounts.forEach(e => sum += e.value);
    }
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
    events.forEach((e) => { e[value] ? q += e[value] : q += 0; });

    return q;
  }

  getTotalTillCurrent(current: Entry, list: Entry[]) {
    let value = this.available;

    const hasBase = list.find((e) => {
      return (e.date === current.date) && e.base;
    });
    const lastBase = list.sort( (a, b) => a.date >= b.date ? -1 : 1).filter(e => e.base && e.date <= current.date);
    // console.log(lastBase[0]);

    list.sort((a, b) => a.date >= b.date ? 1 : -1 );
    if (lastBase[0]) {
      value = lastBase[0].value;
      list = list.filter((a) => a.date >= lastBase[0].date && a.date <= current.date && !a.base && !a.paid );
    } else {
      list = list.filter((a) => moment(a.date).startOf('day') <= moment(current.date).startOf('day') && !a.paid);
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
      value += list[i].value;
    }
   // console.log(value);
    return value;
  }

  loadEvents() {

    this.entryService.getAllEntries(true).subscribe((data: Array<Entry>) => {
      this.events = [];
      console.log(data);
      const joData = JSON.parse(JSON.stringify(data));
      data.forEach(element => {
        if (!element.paid) {
        this.events.push({
          start: new Date(element.date),
          title: element.category + ' / ' + (element.note ? element.note : '') + ' ' + element.value,
          color: colors.yellow,
          allDay: true,
          value: element.value,
          income: (element.type === 'income' ? element.value : 0),
          expense: (element.type === 'expense' ? element.value : 0),
          total: this.getTotalTillCurrent(element, joData),
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          id: element._id,
          weekday: new Date(element.date).getDay(),
          weeknumber: this.getWeekNumber(new Date(element.date)),
          cssClass: element.value > 0 ? 'egreen' : 'ered'
        },

        );
      }
      });

       console.log(this.events);
    });
  }

  loadAccounts() {
    return this.entryService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.loadEvents();
    });
  }

  ngOnInit() {
    this.accountSubcription = this.loadAccounts();
    this.getSnapshots();
    console.log(this.events);
  }

  ngOnDestroy() {
    this.accountSubcription.unsubscribe();
  }

  getWeekNumber( d: Date ): number {
     // Copy date so don't modify original
     d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
     // Set to nearest Thursday: current date + 4 - current day number
     // Make Sunday's day number 7
     d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
     // Get first day of year
     const yearStart: Date = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const newLocal: number = (d.getTime() - yearStart.getTime());
     // Calculate full weeks to nearest Thursday
     const weekNo: number = Math.ceil(( ( newLocal / 86400000) + 1) / 7);
     // Return array of year and week number
     return  weekNo;
  }

  doSnapshot() {
    console.log(this.events);
    const timestamp = moment().valueOf();
    this.events.forEach((e) => {
      e.date = timestamp;
    });

    this.entryService.doSnapshot(this.events).subscribe((data) => {
      // console.log(data);
      this.getSnapshots();
    });
  }

  getSnapshots() {
    this.entryService.getSnapshots()
    .subscribe((data) => {
      console.log(data.sort((a, b) => {
        return a.createdon > b.createdon ? -1 : 1;
      })
      .slice(0, this.numberofsnapshots));

      this.snapshots = data
                      .sort((a, b) => {
                        return a.createdon > b.createdon ? -1 : 1;
                      });
    });
  }

  loadSnapshot(snapshot) {
    snapshot.events.map((e) => {
        e.start = new Date(e.start);
        const events = this.events.filter((k) => {
          return k.weekday === e.weekday && k.weeknumber === e.weeknumber;
        });

        events.forEach(element => {
          element._total = e.total;
        });

    });
    console.log(this.events);
    // this.events = snapshot.events;
  }

  get lastSnapshots(): any[] {
    if (this.snapshots) {
    return this.snapshots.slice(0, this.numberofsnapshots);
    } else {
      return this.snapshots;
    }
  }

  moreSnapshots() {
    this.numberofsnapshots += 1;
  }

  removeSnapshot(s) {
    if ( confirm('Да се изтрие ли записа?') ) {
    const self = this;
    this.entryService.removeSnapshot(s).subscribe(function(data) {
      self.getSnapshots();
    });
  }
  }

  getDayClass(event) {
    let className = 'cal-day-badge green';
    if (event.total < 0) {
      className = 'cal-day-badge red';
    } else if (event.total < 200) {
      className = 'cal-day-badge orange';
    } else {
      className = 'cal-day-badge green';
    }
    return className;
  }

}

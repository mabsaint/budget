import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { CalendarComponent } from './components/calendar.component';
import { CalendarComponent } from './components/calendar.component';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';

import { PipeModule } from '../../core/pipes/pipes.modddue';
import * as moment from 'moment';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    PipeModule,
 //   BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory
    })
  ]
})
export class MyCalendarModule { }

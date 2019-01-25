import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { CalendarComponent } from './components/calendar.component';
import { CalendarComponent } from './components/calendar.component';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PipeModule } from '../../core/pipes/pipes.modddue';

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
      useFactory: adapterFactory
    })
  ]
})
export class MyCalendarModule { }

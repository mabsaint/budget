import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'src/app/modules/home/components/home/home.component';
import { ExpenseComponent } from 'src/app/modules/entries/components/expense/expense.component';
import { IncomeComponent } from 'src/app/modules/entries/components/income/income.component';
import { CalendarComponent } from 'src/app/modules/calendar/components/calendar.component';
import { AccountComponent } from 'src/app/modules/account/components/account/account.component';

import { HomeModule } from 'src/app/modules/home/home.module';
import { EntriesModule } from 'src/app/modules/entries/entries.module'; 
import { MyCalendarModule } from 'src/app/modules/calendar/calendar.module';
import { AccountModule } from 'src/app/modules/account/account.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'accounts',
    component: AccountComponent
  },
  {
    path: 'expenses',
    component: ExpenseComponent
  },
  {
    path: 'incomes',
    component: IncomeComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeModule, EntriesModule, MyCalendarModule, AccountModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

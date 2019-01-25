import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'src/app/modules/home/components/home/home.component';
import { ExpenseComponent } from 'src/app/modules/entries/components/expense/expense.component';
import { IncomeComponent } from 'src/app/modules/entries/components/income/income.component';

import { HomeModule } from 'src/app/modules/home/home.module';
import { EntriesModule } from 'src/app/modules/entries/entries.module'; 

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'expenses',
    component: ExpenseComponent
  },
  {
    path: 'incomes',
    component: IncomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeModule, EntriesModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

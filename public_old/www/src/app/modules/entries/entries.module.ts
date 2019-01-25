import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomeComponent } from './components/income/income.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExpenseComponent, IncomeComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ExpenseComponent, IncomeComponent]
})
export class EntriesModule { }

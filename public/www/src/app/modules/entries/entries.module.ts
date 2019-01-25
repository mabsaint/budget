import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomeComponent } from './components/income/income.component';
import { FilterDateComponent } from './components/filter-date.component';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatFormFieldModule } from '@angular/material';



@NgModule({
  declarations: [ExpenseComponent, IncomeComponent, FilterDateComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule
  ],
  exports: [ExpenseComponent, IncomeComponent]
})
export class EntriesModule { }

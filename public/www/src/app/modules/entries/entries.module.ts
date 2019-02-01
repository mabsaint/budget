import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomeComponent } from './components/income/income.component';
import { FilterDateComponent } from './components/filter-date.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatFormFieldModule, MatAutocompleteModule } from '@angular/material';



@NgModule({
  declarations: [ExpenseComponent, IncomeComponent, FilterDateComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  exports: [ExpenseComponent, IncomeComponent]
})
export class EntriesModule { }

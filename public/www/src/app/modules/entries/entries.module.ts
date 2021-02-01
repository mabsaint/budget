import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomeComponent } from './components/income/income.component';
import { FilterDateComponent } from './components/filter-date.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatFormFieldModule, MatAutocompleteModule } from '@angular/material';
import { PipeModule } from '../../core/pipes/pipes.modddue';
import {CustomDateAdapter} from '../../customdateadapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@NgModule({
  declarations: [ExpenseComponent, IncomeComponent, FilterDateComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    PipeModule
  ],
  exports: [ExpenseComponent, IncomeComponent],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter}]

})
export class EntriesModule { }

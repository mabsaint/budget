import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SumPipe } from './sum.pipe'; // <---
import { SumweeklyPipe } from './sumweekly.pipe';
import { FmomentPipe } from './fmoment.pipe';
import { FilterPipe } from './filter.pipe';
import { SortPipe } from './sort.pipe';
import { RsortPipe } from './rsort.pipe';

@NgModule({
  declarations: [ SumPipe, SumweeklyPipe, FmomentPipe, FilterPipe, SortPipe, RsortPipe ], // <---
  imports: [ CommonModule ],
  exports: [ SumPipe, SumweeklyPipe, FmomentPipe, FilterPipe, SortPipe, RsortPipe ] // <---
})

export class PipeModule {}

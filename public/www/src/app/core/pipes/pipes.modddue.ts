import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SumPipe } from './sum.pipe'; // <---
import { SumweeklyPipe } from './sumweekly.pipe';
import { FmomentPipe } from './fmoment.pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [ SumPipe, SumweeklyPipe, FmomentPipe, FilterPipe ], // <---
  imports: [ CommonModule ],
  exports: [ SumPipe, SumweeklyPipe, FmomentPipe, FilterPipe ] // <---
})

export class PipeModule {}

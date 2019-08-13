import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {SumPipe} from './sum.pipe'; // <---
import { SumweeklyPipe } from './sumweekly.pipe';

@NgModule({
  declarations:[SumPipe, SumweeklyPipe], // <---
  imports:[CommonModule],
  exports:[SumPipe, SumweeklyPipe] // <---
})

export class PipeModule{}

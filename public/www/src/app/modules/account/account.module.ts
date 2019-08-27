import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './components/account/account.component';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../../core/pipes/pipes.modddue';

@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    PipeModule
  ]
})
export class AccountModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { PipeModule } from 'src/app/core/pipes/pipes.modddue';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [
   CommonModule,
   PipeModule,
   FormsModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }

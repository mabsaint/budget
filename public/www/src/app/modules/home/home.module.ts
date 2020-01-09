import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { PipeModule } from 'src/app/core/pipes/pipes.modddue';

@NgModule({
  declarations: [HomeComponent],
  imports: [
   CommonModule,
   PipeModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }

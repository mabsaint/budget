import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Entry } from '../../models/entry';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  model = new Entry("Test","Test note", 250);
  submitted = false;
  constructor() { }

  onSubmit(){
    this.submitted = true;
    // Put changes ....
    
  }
  ngOnInit() {
  }

  get diagnostic() { return JSON.stringify(this.model); }

}

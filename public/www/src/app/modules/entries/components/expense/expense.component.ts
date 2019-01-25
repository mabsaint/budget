import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Entry } from "../../models/entry";
import { EntryService } from '../../../../services/entry.service';
import {config} from './expense.config';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  model = new Entry();
  list = new Array();
  submitted = false;
  categories = config.categories.sort((a,b) => {return a.title >b.title ? 0 : -1});
  periods = config.periods;

  private _from:Date = new Date()
  private _to:Date = new Date(new Date().getFullYear(), new Date().getMonth()+1);
  private JSON:any;

  get total() : number {
    var ans = 0;
    this.list.forEach(element => {
      ans += element.total
    });
    return ans;
  }

  get subcategories() : string[] {
    var currentcat:{title:string,subcategories:string[]} = this.categories.find((a)=>{return a.title == this.model.category});
    return currentcat ? currentcat.subcategories : ['a','b'];
  }

  constructor( private entryService: EntryService) {
    this.JSON = JSON;
   }

  onSubmit(){
    this.submitted = true;
    // Put changes ....
    this.entryService.insertEntry(this.model).subscribe((data: Entry) => {
      this.model = new Entry();
      this.getEntries();
    });
    console.log(this.model);
    
  }

  deleteEntry( id ) {
    this.entryService.deleteEntry( id ).subscribe(() => {
      this.getEntries();
    });
  }

  editEntry( item: Entry ) {
    this.model = item;
  }

  getEntries() {
    console.log(this._from);

    this.entryService.getEntries(this._from, this._to).subscribe((data: Array<Entry>) => {
      this.list = data.sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      });
    });
  }

  ngOnInit() {
   this.getEntries();
   this.model = new Entry();
  
  }


  setInterval(data: Date[]) {
   this._from = data[0];
   this._to = data[1];

   this.getEntries();
  }

  get diagnostic() { return JSON.stringify(this.model); }



}

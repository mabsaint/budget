import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup } from '@angular/forms';
import { Entry, ICategory } from '../../models/entry';
import { EntryService } from '../../../../services/entry.service';
import {config} from './expense.config';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  model = new Entry();
  list = new Array();
  submitted = false;
  categories: ICategory[] = [];
  // subcategories: ICategory[] = [];
  filteredCategories: Observable<ICategory[]>;
  filteredSubCategories: Observable<ICategory[]>;
  periods = config.periods;
  nfilter = '';
  showForm = false;

  json = JSON;

  myGroup = new FormGroup({
    catControl: new FormControl()
  });

  catControl: FormControl = new FormControl();
  subcatControl: FormControl = new FormControl();

  private _from: Date = new Date();
  private _to: Date = new Date(new Date().getFullYear(), new Date().getMonth() + 1);
  private JSON: any;

  get total(): number {
    let ans = 0;
    this.list.forEach(element => {
      ans += element.value;
    });
    return ans;
  }

  get subcategories(): ICategory[] {
    // tslint:disable-next-line:max-line-length
    const currentcat: ICategory = this.categories ? this.categories.find((a) => a.title === this.model.category) : null;

    return currentcat ? currentcat.subcategories : [];
  }

  constructor( private entryService: EntryService) {
    this.JSON = JSON;
   }

   ngOnInit() {

    this.entryService.getCategories()
      .subscribe((data: any[]) => {
        this.categories  = data.sort((a, b) =>  a.title > b.title ? 0 : -1 );
      });

    this.catControl.valueChanges.subscribe( v => {
      console.log(v);
      this.model.category = v;
    });


    this.filteredCategories = this.catControl.valueChanges
    .pipe(
      startWith(''),
      map( v => this._filter(v))
    );

    this.subcatControl.valueChanges.subscribe( v => {
      console.log(v);
      this.model.subcategory = v;
    });

   this.getEntries();
   this.model = new Entry();

  }

  onFocus ( e ) {
    this.filteredCategories = this.catControl.valueChanges
    .pipe(
      startWith(''),
      map( v => this._filter(v))
    );

    console.log( this.filteredCategories);
  }

  onSubFocus ( e ) {
    /*
    this.filteredSubCategories = this.catControl.valueChanges
    .pipe(
      startWith(''),
      map( v => this._filter(v))
    );
    */
   console.log( this.model.category );
  }

  _filter(v): ICategory[] {
    const filterValue = v.toLowerCase();

    return this.categories.filter(option => option.title ? option.title.toLowerCase().includes(filterValue) : '');

  }

  onSubmit() {
    this.submitted = true;
    // Put changes ....
    this.entryService.insertEntry(this.model).subscribe((data: Entry) => {
      this.model = new Entry();
      this.catControl = new FormControl();
      this.subcatControl = new FormControl();
      this.getEntries();
    });
    console.log(this.model);

  }

  onCategoryFocus() {
   this.filteredCategories = this.catControl.valueChanges
   .pipe(
     startWith(''),
     map( v => this._filter(v))
   );

  }

  deleteEntry( id ) {
    this.entryService.deleteEntry( id ).subscribe(() => {
      this.getEntries();
    });
  }

  payEntry( id ) {
    this.entryService.payEntry( id ).subscribe(() => {
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

  setInterval(data: Date[]) {
   this._from = moment(data[0]).startOf('day').toDate();
   this._to = data[1];

   this.getEntries();
  }

  getDate(date: Date) {
    return moment(date).startOf('day').format('DD-MM-YYYY');
  }

  get diagnostic() { return JSON.stringify(this.model); }

  getDailyExpense(day: Date) {
    return this.list.filter(l => moment(l.date).format('MMMM Do') === moment(day).format('MMMM Do')).reduce((a, b) => a + b['value'], 0);
  }

  toggleForm(event) {
    this.showForm = !this.showForm;
  }

}

import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Entry } from '../modules/entries/models/entry';
import { Observable } from 'rxjs';
import { BankAccount } from '../modules/account/account.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private url: string;
  constructor( private http: HttpClient ) {
//    this.url = "http://localhost:3000/";
    this.url = 'http://mybudget.website:3000/';
   }

  insertEntry( entry: Entry ): Observable<Entry> {
    console.log('Into Service ' + this.url + 'expense' + entry);
    return this.http.post<Entry>( this.url + entry.type, entry, httpOptions );
  }

  getEntries(from: Date = null, to: Date = null): Observable<Array<Entry>> {
    console.log(from.toISOString().substr(0, 10));
    // tslint:disable-next-line:max-line-length
    // return this.http.get<Array<Entry>>(this.url + 'expense/grouped/' + from.toISOString().substr(0,10) + '/' + to.toISOString().substr(0,10));
    return this.http.get<Array<Entry>>(this.url + 'expense/' + from.toISOString().substr(0, 10) + '/' + to.toISOString().substr(0, 10));
  }

  getIncomeEntries(from: Date = null, to: Date = null): Observable<Array<Entry>> {
    console.log(from.toISOString().substr(0, 10));
    return this.http.get<Array<Entry>>(this.url + 'income/' + from.toISOString().substr(0, 10) + '/' + to.toISOString().substr(0, 10));
  }

  getAllEntries(fromnow: boolean = false): Observable<Array<Entry>> {
    if ( fromnow ) {
      return this.http.get<Array<Entry>>(this.url + 'all/' + (new Date().toISOString().substr(0, 10)));
      } else {
        return this.http.get<Array<Entry>>(this.url + 'all/');
      }
  }

  getAllFromDateEntries(start: string): Observable<Array<Entry>> {
      return this.http.get<Array<Entry>>(this.url + 'all/' + (new Date(start).toISOString().substr(0, 10)));
  }

  deleteEntry( id: String): Observable<void> {
    return this.http.put<void>(this.url + 'expense/delete/' + id, id);
  }

  payEntry( id: String): Observable<void> {
    return this.http.put<void>(this.url + 'expense/pay/' + id, id);
  }

  insertAccount(account:  BankAccount): Observable<BankAccount[]> {
    account.updatedOn = new Date();
    return this.http.post<BankAccount[]>(this.url + 'accounts', account, httpOptions);
  }

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.url + 'accounts');
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'categories');
  }

  getGroupedExpenses(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'grouped');
  }

}

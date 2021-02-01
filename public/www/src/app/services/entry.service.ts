import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Entry } from '../modules/entries/models/entry';
import { Observable } from 'rxjs';
import { BankAccount } from '../modules/account/account.model';

import * as moment from 'moment';
import { environment } from 'src/environments/environment';

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
    this.url = environment.baseURL + ':3100/';
   }

  insertEntry( entry: Entry ): Observable<Entry> {
    console.log('Into Service ' + this.url + 'expense' + entry);
    return this.http.post<Entry>( this.url + entry.type, entry, httpOptions );
  }

  getEntries(from: Date = null, to: Date = null): Observable<Array<Entry>> {
    console.log(moment(from).startOf('day').format('YYYY-MM-DD'));
    // tslint:disable-next-line:max-line-length
    // return this.http.get<Array<Entry>>(this.url + 'expense/grouped/' + from.toISOString().substr(0,10) + '/' + to.toISOString().substr(0,10));
    const strfrom = moment(from).startOf('day').format('YYYY-MM-DD');
    const strto = moment(to).startOf('day').format('YYYY-MM-DD');
    return this.http.get<Array<Entry>>(this.url + 'expense/' + strfrom + '/' + strto);
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

  getAllFromDateEntries(start: string, end?: string): Observable<Array<Entry>> {
    let uri = (new Date(start).toISOString().substr(0, 10));
    if (end) {
      uri += '/' + (new Date(end).toISOString().substr(0, 10));
    }
      return this.http.get<Array<Entry>>(this.url + 'all/' + uri);
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

  getGroupedExpenses(start?: Date, end?: Date): Observable<any[]> {
    let uri = 'grouped';
    if (start) {
      const arg1 = moment(start).format('YYYY-MM-DD');
      uri += '/' + arg1;
    }

    if (end) {
      const arg2 = moment(end).format('YYYY-MM-DD');
      uri += '/' + arg2;
    }
    return this.http.get<any[]>(this.url + uri);
  }

  doSnapshot(events: any[]): Observable<any> {
    return this.http.post(this.url + 'snapshot', events);
  }

  getSnapshots(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'snapshot');
  }

  removeSnapshot(snapshot: any): Observable<any[]> {
    return this.http.put<any[]>(this.url + 'removesnapshot', snapshot);
  }

  updatePrice(id: any): Observable<any> {
    return this.http.put<any>(this.url + 'updateentry/', id);
  }

  updateDate(id: any): Observable<any> {
    return this.http.put<any>(this.url + 'updateentrydate/', id);
  }

}

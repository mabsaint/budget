import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Entry } from "../modules/entries/models/entry";
import { Observable } from 'rxjs';
import { BankAccount } from '../modules/account/account.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private url: string;
  constructor( private http: HttpClient ) {
    this.url = "http://localhost:3000/";
   }

  insertEntry( entry: Entry ): Observable<Entry> {
    console.log("Into Service " + this.url + 'expense' + entry);
    return this.http.post<Entry>( this.url + entry.type, entry, httpOptions );
  }

  getEntries(from:Date = null,to:Date=null): Observable<Array<Entry>> {
    console.log(from.toISOString().substr(0,10));
    return this.http.get<Array<Entry>>(this.url + 'expense/grouped/' + from.toISOString().substr(0,10) + '/' + to.toISOString().substr(0,10));
  }

  getIncomeEntries(from:Date = null,to:Date=null): Observable<Array<Entry>> {
    console.log(from.toISOString().substr(0,10));
    return this.http.get<Array<Entry>>(this.url + 'income/grouped/' + from.toISOString().substr(0,10) + '/' + to.toISOString().substr(0,10));
  }

  getAllEntries(fromnow:boolean=false): Observable<Array<Entry>> {
    return fromnow ? this.http.get<Array<Entry>>(this.url + 'all/'+(new Date().toISOString().substr(0,10))) : this.http.get<Array<Entry>>(this.url + 'all/');
  }

  deleteEntry( id: String): Observable<void> {
    return this.http.put<void>(this.url + 'expense/deleteguid/'+id, id);
  }

  insertAccount(account:  BankAccount): Observable<BankAccount[]> {
    account.updatedOn = new Date();
    return this.http.post<BankAccount[]>(this.url + 'accounts', account, httpOptions);
  }

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.url + 'accounts');
  }

}

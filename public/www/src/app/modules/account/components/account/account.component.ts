import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BankAccount } from '../../account.model';
import { EntryService } from '../../../../services/entry.service';
import { config } from '../../account.config';
import { increaseElementDepthCount } from '@angular/core/src/render3/state';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})


export class AccountComponent implements OnInit {

  account: BankAccount;
  list: BankAccount[];
  types: any = config.type;
  @ViewChild('value') valueElement: ElementRef;

  constructor( private entryservice: EntryService ) { }

  ngOnInit() {
    this.account = new BankAccount();
    this.entryservice.getAccounts().subscribe((data) => {
      this.list = data.sort( (a, b) => a.updatedOn <= b.updatedOn ? 1 : -1 );
    })
  }

  onSubmit() {
    this.entryservice.insertAccount(this.account).subscribe((data) => {
    this.list = data.sort( (a, b) => a.updatedOn <= b.updatedOn ? 1 : -1 );
    this.account = new BankAccount();
    })
  }

  editAccount(item: BankAccount) {
    this.account = JSON.parse(JSON.stringify(item));
   this.valueElement.nativeElement.focus();
  }

  deleteAccount(item:BankAccount) {
    //TODO: delete account ....
  }

  get total(): number {
    let sum = 0;
    if(this.list)
    this.list.forEach(e => sum += e.value)
    return sum;
  }

}

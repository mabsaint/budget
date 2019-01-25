import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';

@Component({
    selector: 'filter-date',
    template: `
    Period: {{startdate | date:'dd MMM, yyyy'}} - {{enddate | date:'dd MMM, yyyy'}}<br />
    <input matInput [matDatepicker]="startpicker" placeholder="Choose a start date" [(ngModel)]="startdate" name="startdate"  >
    <mat-datepicker-toggle matSuffix [for]="startpicker" ></mat-datepicker-toggle>
    <mat-datepicker #startpicker ></mat-datepicker> -
    <input matInput [matDatepicker]="endpicker" placeholder="Choose an end date" [(ngModel)]="enddate" name="enddate"  >
    <mat-datepicker-toggle matSuffix [for]="endpicker" ></mat-datepicker-toggle>
    <mat-datepicker #endpicker ></mat-datepicker>
    <hr />
    `
})

export class FilterDateComponent implements OnInit {

    private _startdate: Date;
    private _enddate: Date;

    @Input() get startdate() {
        return this._startdate;
    }

    set startdate(val:Date) {
        this._startdate = val;
        this.changed.emit([this._startdate, this._enddate]);
    }

    @Input() get enddate() {
        return this._enddate;
    }

    set enddate(val:Date) {
        this._enddate = val;
        this.changed.emit([this._startdate, this._enddate]);
    }

    @Output() changed: EventEmitter<Date[]> = new EventEmitter<Date[]>();

    construction(){}

    ngOnInit(){
        // this._startdate = new Date(new Date().getFullYear(), new Date().getMonth());

        this._startdate = new Date();
        this._enddate = new Date(new Date().getFullYear(), new Date().getMonth()+1);
        this._enddate.setDate( this._enddate.getDate() -1);
    }
}

import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
// import { HttpClient } from '@angular/common/http';
// import { Subscription } from 'rxjs';
import { EntryService } from '../../../../services/entry.service';
import { Entry } from '../../../entries/models/entry';
import { BankAccount } from '../../../account/account.model';
import * as moment from 'moment';

highcharts3D(Highcharts);

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const url = 'http://mybudget.website:3000/grouped/';

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accounts: BankAccount[];

  get available(): number {
    let sum = 0;
    if (this.accounts) {
      this.accounts.forEach(e => sum += e.value);
    }
    return sum;
  }
  public options: any = {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0
      }
    },
    title: {
      text: 'Expenses'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
              enabled: true,
              format: '{point.name}'
          }
      }
  },
    series: [
      {
        name: 'Total',
        data: []
      }
    ]
  };

  public cylOptions: any = {
    chart: {
      type: 'column',
      options3d: {
         enabled: false,
         alpha: 15,
         beta: 15,
         depth: 50,
         viewDistance: 25
      }
   },
   xAxis: {
      labels: {
        enabled: false,
        formatter: function () {
          return this.value; // clean, unformatted number for year
        }
      }
   },
   title : {
      text: 'Expenses in BGN'
   },
   tooltip: {
    pointFormat: '{point.name}: <b>{point.y:.1f} лв.</b>'
  },
   plotOptions : {
      cylinder: {
         depth: 25
      },
      series: {
         dataLabels: {
          enabled: true,
          inside: false,
          format: '{point.y}<br/>{point.name}'
        }
      }
   },
   series : [{
    type: 'column',
    name: 'Expenses',
    data: []
   }]
};

public lineOptions: any = {
  chart: {
      type: 'line'
  },
  title: {
      text: 'Monthly Average Balance'
  },
  subtitle: {
      text: 'until the end of the month'
  },
  xAxis: {
    categories: {
      formatter: function () {
          return this.value; // clean, unformatted number for year
      }
    }
  },
  yAxis: {
      title: {
          text: 'Money (BGN)'
      }
  },
  plotOptions: {
      line: {
          dataLabels: {
              enabled: true,
              formatter: function() {
                return this.y;
              }
          },
          enableMouseTracking: false
      }
    //   area: {
    //     pointStart: 1940,
    //     marker: {
    //         enabled: false,
    //         symbol: 'circle',
    //         radius: 2,
    //         states: {
    //             hover: {
    //                 enabled: true
    //             }
    //         }
    //     }
    // }
  },
  series: [{
      name: 'Available',
      data: [],
      color: '#80D499'
  }, {
      name: 'Expenses',
      data: [],
      color: '#FFC1B8'
  }]
};

private events: Array<any>;
  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.loadAccounts();
    this.entryService.getGroupedExpenses().subscribe( data => {
      console.log(data);
      const perc = [];
      let total = 0;

      data.forEach( e => {
        e.name = e.name ? e.name : 'Other';
        total += e.y;
      });

      data.forEach( e => {
        perc.push({name: e.name ? e.name : 'Other', y: parseFloat( ( (e.y / total) * 100 ).toFixed(2) )});
      });
      console.log(perc);
      this.options.series[0].data = perc;
      this.cylOptions.series[0].data = data;

      Highcharts.chart('pie', this.options); // .setSize(300, 200);
      Highcharts.chart('cylinder', this.cylOptions); // .setSize(300, 200);
    });

    // get all:
      this.entryService.getAllEntries(true).subscribe((data: Array<any>) => {
        this.events = [];
        const totals = [];
        const values = [];
        const xaxis = [];

        data = data.filter( e => new Date(e.date) > new Date() && moment(e.date) <= moment().endOf('month'));

        data.forEach(element => {

          const el = this.events.find(e => e.start === new Date(element.date).getDate());
          if (el) {
            el.value +=  element.value < 0 ? element.value * (-1) : element.value;
            el.total = this.getTotalTillCurrent(element, JSON.parse(JSON.stringify(data)));
            el.datestr = element.date;
          } else {
          this.events.push({
            start: new Date(element.date).getDate(),
            datestr: element.date,
            value: element.value < 0 ? element.value * (-1) : 0,
            total: this.getTotalTillCurrent(element, JSON.parse(JSON.stringify(data)))
          });
        }
        });
        this.events = this.events.sort( (a, b) => a.start > b.start ? 1 : -1 );
        this.events.forEach( (e) => {
          values.push( e.value );
          totals.push( e.total );
          xaxis.push(moment(e.datestr).format('Do MMM'));
        });

        this.lineOptions.series[0].data = totals;
        this.lineOptions.series[1].data = values;
        this.lineOptions.xAxis.categories = xaxis;
        // this.lineOptions.plotOptions.area.pointStart = xaxis[0];
        Highcharts.chart('line', this.lineOptions); // .setSize(300, 200);
         console.log(this.events);
      });


  }

  loadAccounts() {
    this.entryService.getAccounts().subscribe((data) => {
      this.accounts = data;
    });
  }

  getTotalTillCurrent(current: Entry, list: Entry[]) {
    let value = this.available;

    const hasBase = list.find((e) => {
      return (e.date === current.date) && e.base;
    });
    const lastBase = list.sort( (a, b) => a.date >= b.date ? -1 : 1).filter(e => e.base && e.date <= current.date);
    // console.log(lastBase[0]);

    list.sort((a, b) => a.date >= b.date ? 1 : -1 );
    if (lastBase[0]) {
      value = lastBase[0].value;
      list = list.filter((a) => a.date >= lastBase[0].date && a.date <= current.date && !a.base );
    } else {
      list = list.filter((a) => a.date < current.date);
    }
    /*
    if(!hasBase)
      list = list.filter((a) => { return (a.date <= current.date)  });
    else
      list = list.filter((a) => { return a.date == current.date && !a.base });
*/
    // console.log(current.date + ":" + hasBase)
    // console.log(list);

    for (let i = 0; i < list.length; i++) {
      value += list[i].value;
    }
   // console.log(value);
    return value;
  }

}

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
  accounts: BankAccount[] = [];
  expenses: Entry[];
  totalExpense = 0;

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
      text: 'Разходи (%)'
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
        name: 'Всичко',
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
    title: {
      text: 'Разходи в лв.'
    },
    tooltip: {
      pointFormat: '{point.name}: <b>{point.y:.1f} лв.</b>'
    },
    plotOptions: {
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
    series: [{
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
      text: 'Месечен баланс'
    },
    subtitle: {
      text: 'до края на месеца ' + moment().endOf('month').fromNow()
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
          formatter: function () {
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
      name: 'Налични',
      data: [],
      color: '#80D499',
      colorValue: '#00ff00'
    }, {
      name: 'Разходи',
      data: [],
      color: '#FFC1B8'
    }]
  };

  public balanceOptions: any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: 'Баланс',
      align: 'center',
      verticalAlign: 'middle',
      y: 60
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} ( {point.percentage:.1f}% )</b>'
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
          distance: -50,
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
        size: '110%',
        colors: ['#80D499', '#FFC1B8', '#ccc']
      }

    },
    series: [{
      type: 'pie',
      name: 'Баланс',
      innerSize: '50%',
      data: []
    }]
  };
  private events: Array<any>;
  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.loadAccounts();
    this.entryService.getGroupedExpenses(moment().startOf('month').toDate(), moment().endOf('month').toDate()).subscribe(data => {
      console.log(data);
      const perc = [];
      let total = 0;

      data.forEach(e => {
        e.name = e.name ? e.name : 'Other';
        total += e.y;
      });

      data.forEach(e => {
        perc.push({ name: e.name ? e.name : 'Other', y: parseFloat(((e.y / total) * 100).toFixed(2)) });
      });
      console.log(perc);
      this.expenses = data;
      console.log(this.expenses);
      this.options.series[0].data = perc;
      this.cylOptions.series[0].data = data;
      this.totalExpense = total;

      Highcharts.chart('pie', this.options); // .setSize(300, 200);
      Highcharts.chart('cylinder', this.cylOptions); // .setSize(300, 200);
    });

    // get all:
    this.entryService.getAllFromDateEntries(moment().startOf('day').format('YYYY-MM-DD'),
                                            moment().add(30, 'days').format('YYYY-MM-DD'))
    .subscribe((data: Array<any>) => {
      this.events = [];
      const totals = [];
      const values = [];
      const xaxis = [];
      const exp = data.filter(e => e.type === 'expense').reduce((t, e) => t - e.value, 0);
      const inc = data.filter(e => e.type === 'income').reduce((t, e) => t + e.value, 0)
      + this.accounts.reduce((t, a) => t + a.value, 0);

      console.log(data.sort((a, b) => a.date >= b.date ? 1 : -1));
      console.log(data.filter(e => e.type === 'income'));
      // data = data.filter(e => moment(e.date).startOf('day') >= moment().startOf('day') && moment(e.date) <= moment().endOf('month'));

      data.filter( e => !e.paid)
      .forEach(element => {

        const el = this.events.find(e => e.start === moment(element.date).startOf('day').format('YYYY-MM-DD'));
        if (el) {
          el.value += element.value < 0 ? element.value * (-1) : 0;
          el.total = this.getTotalTillCurrent(element, JSON.parse(JSON.stringify(data)));
          //  el.datestr =  element.date.substr(0, 19);
        } else {
          this.events.push({
            start: moment(element.date).startOf('day').format('YYYY-MM-DD'),
            datestr: moment(element.date).startOf('day'),
            value: element.value < 0 ? element.value * (-1) : 0,
            total: this.getTotalTillCurrent(element, JSON.parse(JSON.stringify(data)))
          });
        }
      });
      const remains = this.events[this.events.length - 1].total;
      this.events = this.events.sort((a, b) => a.start >= b.start ? 1 : -1);

      console.log(this.events);

      this.events.forEach((e) => {
        values.push(e.value);
        totals.push(e.total);
        xaxis.push(moment(e.datestr).format('Do MMM'));
      });

      this.lineOptions.series[0].data = totals;
      this.lineOptions.series[1].data = values;
      this.lineOptions.xAxis.categories = xaxis;
      // this.lineOptions.plotOptions.area.pointStart = xaxis[0];
      Highcharts.chart('line', this.lineOptions); // .setSize(300, 200);

      this.balanceOptions.series[0].data = [['Приходи', inc], ['Разходи', exp], ['Рзлика', (inc - (exp + remains))]];
      Highcharts.chart('balance', this.balanceOptions);
      console.log(this.events);
    });


  }

  loadAccounts() {
    this.entryService.getAccounts().subscribe((data) => {
      this.accounts = data;
    });
  }

  getRemains(current: Entry, list: Entry[]): number {
    return list.filter( t => t.moment.isBefore(current.moment) && !t.paid).reduce((a, b) => a + b.value, this.available);
  }

  getTotalTillCurrent(current: Entry, list: Entry[]) {

    list.forEach(a => a.moment = moment(a.date).startOf('day'));
    list.sort((a, b) => a.moment >= b.moment ? 1 : -1);
    current.moment = moment(current.date).startOf('day');

    const value = this.getRemains(current, list);
    // let inclist: number;
   // value = this.getRemains(current, list);


    // inclist = value + list.filter((a) =>
    //                                     (a.moment < current.moment) &&
    //                                     !a.paid && a.type === 'income'
    //                               ).reduce((a, b) => a + b.value, 0);

    return value;

  }

}

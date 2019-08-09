import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
// import { HttpClient } from '@angular/common/http';
// import { Subscription } from 'rxjs';
import { EntryService } from '../../../../services/entry.service';

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
         enabled: true,
         alpha: 15,
         beta: 15,
         depth: 50,
         viewDistance: 25
      }
   },
   title : {
      text: 'Expenses in BGN'
   },
   tooltip: {
    pointFormat: '{series.name}: <b>{point.y:.1f} лв.</b>'
  },
   plotOptions : {
      cylinder: {
         depth: 25
      }
   },
   series : [{
     type: 'column',
    name: 'Expenses',
    data: []
   }]
};

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getGroupedExpenses().subscribe( data => {
      console.log(data);
      var perc = [];
      var total = 0;
      data.forEach( e => {
        total += e.y;
      });

      data.forEach( e => {
        perc.push({name: e.name, y: parseFloat( ( (e.y / total) * 100 ).toFixed(2) )});
      });
      console.log(perc);
      this.options.series[0].data = perc;
      this.cylOptions.series[0].data = data;
      Highcharts.chart('pie', this.options);
      Highcharts.chart('cylinder', this.cylOptions);
    });

  }

}

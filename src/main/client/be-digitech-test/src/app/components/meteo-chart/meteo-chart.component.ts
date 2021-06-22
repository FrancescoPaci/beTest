import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-meteo-chart',
  templateUrl: './meteo-chart.component.html',
  styleUrls: ['./meteo-chart.component.css']
})
export class MeteoChartComponent implements OnInit {

  constructor() { }

  @Input()
  datiChart

   ngOnInit(): void {}

   ngOnChanges(): void {
     if(this.datiChart && this.datiChart.length > 0) {
       this.showMsg = false
       this.createChartData(this.datiChart)
     } else {
        this.data = []
        this.showMsg = true
     }
   }

   ngOnDestroy() {
     this.resize.unsubscribe()
   }

   type
   data = []
   columns
   options = {}
   width
   height
   numProdotti
   showMsg = false
   title

   resize = fromEvent(window, 'resize').pipe(debounceTime(500)).subscribe(() => {
       this.resizeChart()
   })

 createChartData(datiGraph) {
      var data = []
      for(var i=0; i < datiGraph.length; i++){
        data.push([parseInt(this.getTimeOfMeteo(datiGraph[i].dt_txt)), datiGraph[i].main.humidity, datiGraph[i].main.temp])
      }
      this.title = this.getDayOfMeteo(datiGraph[0].dt_txt)
      this.createChart(data)
   }

   getTimeOfMeteo(date) {
     return date.substring(10, 13)
   }

   getDayOfMeteo(date) {
      return date.substring(0, 10)
    }

   createChart(data) {
      this.columns = ['Ore', 'Umidità', 'Temperatura']
      this.type = 'LineChart'
      this.options = {
            hAxis: {
               title: 'Ore'
             },
             /*vAxes: {
                     0: {title: 'Umidità', minorGridlines: {color: 'none'}},
                     1: {title: 'Temperatura', minorGridlines: {color: 'none'}} //7gridlines
               },*/
              pointSize: 5,
              legend: { position: 'top' },
          }
      this.data = data
      this.resizeChart()
    }

   resizeChart() {
      let w = $("#meteo-chart").width()
      let h = $("#meteo-chart").width() / 3
      //this.options['chartArea'] = {left: w/100*15, right: w/100*15, top: h/100*15, bottom: h/100*15, width: '20%', height: '20%'}
      this.width = w
      this.height = h
    }
}

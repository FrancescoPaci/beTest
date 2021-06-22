import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../services/http.service'

import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {

    constructor(private httpService: HttpService) {}

    @Input()
    city

    meteoUrl:string = 'http://api.openweathermap.org/data/2.5/forecast?q='
    APPID:string = '891b9ccfc39890d8f17b2f8bc612a1db'
    meteo = []
    meteoErr = false
    datiGraph

    ngOnChanges(): void {
      if(this.city) {
        this.getMeteo()
      }
    }

    ngOnInit(): void {}

    getIconUrl(icon) {
      return 'http://openweathermap.org/img/w/' + icon + ".png"
    }

    getDayOfMeteo(date) {
      return date.substring(0, 10)
    }

    getTimeOfMeteo(date) {
      return date.substring(10, 13)
    }

    showChart(day) {
      this.datiGraph = day
    }

    getMeteo() {
      this.datiGraph = null
      this.httpService.callGetOutside(this.meteoUrl+this.city+'&APPID='+this.APPID+'&units=metric').subscribe(
        data => {
          let hours = data['list']
          let newday = hours[0].dt_txt.substring(0, 10)
          let meteo = []
          let day = []
          for(let i = 0; i < hours.length; i++){
             if(newday !== hours[i].dt_txt.substring(0, 10)){
                meteo.push(day)
                day = []
                newday = hours[i].dt_txt.substring(0, 10)
             } else {
                day.push(hours[i])
             }
          }
          this.meteo = meteo
          this.meteoErr = false
        },
        error => {
          this.meteoErr = true
        },
        () => {}
      )
    }


}

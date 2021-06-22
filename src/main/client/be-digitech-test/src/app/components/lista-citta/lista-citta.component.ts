import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lista-citta',
  templateUrl: './lista-citta.component.html',
  styleUrls: ['./lista-citta.component.css']
})
export class ListaCittaComponent implements OnInit {

  constructor() { }

  @Input()
  cities

  city: string = null
  newCity = ''

  ngOnChanges(): void {}

  ngOnInit(): void {}

  saveNewCity() {
    this.cities.push(this.newCity)
  }

  deleteCity(index) {
    this.cities.splice(index, 1)
  }

  showMeteo(city){
    this.city = city
  }

}

import { Component } from '@angular/core'
import { HttpService } from './services/http.service'
import { Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private httpService:HttpService, private router: Router){
   router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        this.page = this.pages.find(function (o) { return o.route == router.url }).title
      }
    });
  }

  siteColor = localStorage.getItem("siteColor") || 'white'
  page: string
  pages = [
    {title: 'Home Page', route: '/homePage'},
    {title: 'Login', route: '/loginPage'},
    {title: 'Crea Account', route: '/createAccount'}
  ]

  ngOnInit(){}

  setDarkSite(){
    var siteColor = localStorage.getItem("siteColor")
    if(!siteColor || siteColor === "white"){
      localStorage.setItem("siteColor", "dark")
      this.siteColor = "dark"
    } else if(siteColor === "dark"){
      localStorage.setItem("siteColor", "white")
      this.siteColor = "white"
    }
  }

  logout(){
    localStorage.removeItem('auth')
    localStorage.removeItem('userRole')
    this.router.navigate(['loginPage'])
  }

  hideLogout(){
    return this.page === 'Login' || this.page === 'Crea Account'
  }

}



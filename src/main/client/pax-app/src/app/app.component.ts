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
        this.role = localStorage.getItem('userRole')
      }
    });
  }

  role: string
  siteColor = localStorage.getItem("siteColor") || 'white'
  page: string
  pages = [
    {title: 'Ordini FE', route: '/ordini', roles: ['ADMIN'], disabled: true},
    {title: 'Ordini BE', route: '/ordiniBe', roles: ['ADMIN']},
    {title: 'Home Page', route: '/homePage', hidden: true},
    {title: 'Login', route: '/loginPage', hidden: true},
    {title: 'Crea Account', route: '/createAccount', hidden: true}
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



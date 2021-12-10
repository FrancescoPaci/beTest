import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errMsg = ""
  model: any = {}

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit(): void { }

  login() {
    if (this.model.username && this.model.password) {
      sessionStorage.setItem('auth', window.btoa(this.model.username + ":" + this.model.password))
      this.httpService.callGet('login', "Errore in fase di login").subscribe(
        data => {
          //this.sendMail()
          sessionStorage.setItem('userRole', data[0].authority)
          this.router.navigate(['ordiniBe'])
          this.errMsg = ""
        },
        error => {
          this.errMsg = "Errore in fase di login"
        },
        () => { }
      )
    } else {
      this.errMsg = "Immettere Utente e Password"
    }
  }

  goToRegister() {
    this.router.navigate(['createAccount'])
  }

  sendMail() {
    this.httpService.callGet('sendMail', "Errore all'invio della mail").subscribe(
      data => { },
      error => { },
      () => { }
    )
  }

}

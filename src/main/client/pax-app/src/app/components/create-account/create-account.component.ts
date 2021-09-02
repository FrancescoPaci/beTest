import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  constructor(private httpService: HttpService, private router: Router) { }

  errMsg = ""
  model: any = {}

  ngOnInit(): void { }

  checkPassword() {
    if (this.model.password && this.model.password2) {
      if (this.model.password === this.model.password2) {
        this.errMsg = ''
        return true
      }
      this.errMsg = 'Le password devonno essere uguali'
      return false
    }
    return false
  }

  register() {
    if (this.model.username && this.model.password) {
      var params = '?username=' + this.model.username + '&psw=' + this.model.password
      this.httpService.callGet('createAccount' + params, "Non è stato possibile creare l'account").subscribe(
        data => {
          this.router.navigate(['loginPage'])
        },
        error => {
          this.errMsg = "Errore in fase di registrazione"
        },
        () => { }
      )
    } else {
      this.errMsg = "Immettere Utente e Password e Confermaa Password"
    }
  }

  goToLogin() {
    this.router.navigate(['loginPage'])
  }

}

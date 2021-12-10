import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { HttpService } from '../services/http.service'

@Injectable()
export class RouteGuardService implements CanActivate {

  constructor(private router: Router, private httpService: HttpService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(sessionStorage.getItem('auth')){
      return true
    }
    this.router.navigate(['loginPage'])
    return false
  }

}

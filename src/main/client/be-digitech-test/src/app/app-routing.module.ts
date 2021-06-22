import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from './services/route-guard.service'
import { HttpService } from './services/http.service'

import { LoginComponent } from './components/login/login.component'
import { HomePageComponent } from './components/home-page/home-page.component'
import { CreateAccountComponent } from './components/create-account/create-account.component'

const routes: Routes = [
  { path: 'homePage', component: HomePageComponent, canActivate: [RouteGuardService] },
  { path: 'loginPage', component: LoginComponent },
  { path: 'createAccount', component: CreateAccountComponent },
  { path: '', redirectTo: 'homePage', pathMatch: 'full', canActivate: [RouteGuardService] },
  { path: '**', redirectTo: 'homePage' , pathMatch: 'full', canActivate: [RouteGuardService] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuardService]
})
export class AppRoutingModule { }

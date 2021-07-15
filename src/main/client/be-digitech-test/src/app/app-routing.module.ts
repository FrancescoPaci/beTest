import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from './services/route-guard.service'
import { HttpService } from './services/http.service'

import { LoginComponent } from './components/login/login.component'
import { HomePageComponent } from './components/home-page/home-page.component'
import { OrdiniComponent } from './components/ordini/ordini.component'
import { OrdiniBeComponent } from './components/ordini-be/ordini-be.component'
import { CreateAccountComponent } from './components/create-account/create-account.component'

const routes: Routes = [
  { path: 'ordiniBe', component: OrdiniBeComponent, canActivate: [RouteGuardService] },
  { path: 'ordini', component: OrdiniComponent, canActivate: [RouteGuardService] },
  { path: 'loginPage', component: LoginComponent },
  { path: 'createAccount', component: CreateAccountComponent },
  { path: '', redirectTo: 'ordini', pathMatch: 'full', canActivate: [RouteGuardService] },
  { path: '**', redirectTo: 'ordini' , pathMatch: 'full', canActivate: [RouteGuardService] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuardService]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { tap } from 'rxjs/operators'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}

  baseUrl: string = '/api/'

  callGetOutside(url){
    return this.http.get(url).pipe(tap(
      data => {},
      error => {},
      () => {}
    ))
  }

  callGet(url){
    return this.http.get(this.baseUrl + url).pipe(tap(
      data => {},
      error => {},
      () => {}
    ))
  }

  callPost(url, item){
    return this.http.post(this.baseUrl + url, item).pipe(tap(
      data => {},
      error => {},
      () => {}
    ))
  }

}

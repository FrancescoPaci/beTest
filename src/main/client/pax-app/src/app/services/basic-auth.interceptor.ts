import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../services/http.service'

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(private httpService: HttpService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(request.url.startsWith("/api/")){
      request = request.clone({
        setHeaders: {
          Authorization: 'Basic ' + sessionStorage.getItem('auth')
        }
      })
    }
    return next.handle(request);
  }
}

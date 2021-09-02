import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { tap } from 'rxjs/operators'
import { AlertModalComponent } from '../components/alert-modal/alert-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private modalService: BsModalService) { }

  baseUrl: string = '/api/'
  serverOn: boolean = true

  callGetOutside(url: string) {
    return this.http.get(url).pipe(tap(
      data => { },
      error => { },
      () => { }
    ))
  }

  callGet(url: string, errorMsg: string) {
    return this.http.get(this.baseUrl + url).pipe(tap(
      data => { },
      error => {
        if (error.status != 504) {
          this.openModal('Errore', errorMsg, error.error.cause, error.error.message, error.error.intStatus + " - " + error.error.status)
          this.serverOn = true
        } else {
          if (this.serverOn) {
            this.serverOn = false
            this.openServerOffModal()
          }
        }
      },
      () => { }
    ))
  }

  callPost(url: string, item: any, errorMsg: string) {
    return this.http.post(this.baseUrl + url, item).pipe(tap(
      data => { },
      error => {
        if (error.status != 504) {
          this.serverOn = true
          this.openModal('Errore', errorMsg, error.error.cause, error.error.message, error.error.intStatus + " - " + error.error.status)
        } else {
          if (this.serverOn) {
            this.serverOn = false
            this.openServerOffModal()
          }
        }
      },
      () => { }
    ))
  }

  openModal(title: string, errorMsg: string, cause: string, message: string, status: string) {
    const initialState = {
      title: title,
      text: "<h5>" + errorMsg + "</h5>" +
        "<strong>Status:</strong> " + status + "<br>" +
        "<strong>Causa:</strong> " + cause + "<br>" +
        "<strong>Message:</strong> " + message
    }
    this.modalService.show(AlertModalComponent, { initialState })
  }

  openServerOffModal() {
    const initialState = {
      title: "Attenzione",
      text: "<h5>Il server non risponde</h5>"
    }
    this.modalService.show(AlertModalComponent, { initialState })
  }

}

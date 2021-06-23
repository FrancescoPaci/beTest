import { Component, OnInit } from '@angular/core'
import { HttpService } from '../../services/http.service'
import { FormBuilder, Validators } from '@angular/forms'
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { ExcelService } from '../../services/excel.service'
import { NgxSpinnerService } from "ngx-spinner"

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.css']
})
export class OrdiniComponent implements OnInit {

  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private modalService: BsModalService,
              public excelService: ExcelService, private spinner: NgxSpinnerService) {
    setInterval(() => {
      this.siteColor = localStorage.getItem("siteColor")
    }, 10)

    this.ordersForm = this.formBuilder.group({
      orderDetails: this.formBuilder.array([])
    })
  }

  ordersForm
  orders: any = []
  cities: any = []
  shippers: any = []
  start = 0
  end = 10

  siteColor
  fontSize = 14

  currentPage = 1
  maxSizePagination = 8
  totalItems = 0
  itemsPerPage = 10

  role = localStorage.getItem('userRole')
  datePattern=/^[\d]{4}-[\d]{2}-[\d]{2}$/
  numberPattern=/^[\d]*$/

  ngOnInit(): void {
    this.getOrders()
    this.getTotalOrders()
    this.getShippers()
  }

  setPageActive(event: any, setData): void {
    this.currentPage = event && event.page ? event.page : (this.currentPage || 1)
    this.start = (this.currentPage - 1) * this.itemsPerPage + 1
    this.end = this.currentPage * this.itemsPerPage
    this.getOrders()
  }

  getOrders(){
    let params = '?start='+this.start+'&end='+this.end
    this.httpService.callGet('ordersByRange'+params).subscribe(
      data => {
        this.orders = data
        this.createForm()
        let cities = []
        for(let i = 0; i < this.orders.length; i++){
          if(!cities.includes(this.orders[i].shipCity)){
            cities.push(this.orders[i].shipCity)
          }
        }
        this.cities = cities
      },
      error => {},
      () => {}
    )
  }

  getTotalOrders(){
    this.httpService.callGet('ordersCount').subscribe(
      data => {
        this.totalItems = data as number
      },
      error => {},
      () => {}
    )
  }

  getShippers(){
    this.httpService.callGet('getShippers').subscribe(
      data => {
        this.shippers = data
      },
      error => {},
      () => {}
    )
  }

  modifyOrder(order){
    order.inModifica = true
  }

  cancelModOrder(index){
    delete this.orders[index].inModifica
    this.ordersForm.controls.orderDetails.controls[index].setValue(JSON.parse(JSON.stringify(this.orders[index])))
  }

  saveOrder(index){
    let order = this.ordersForm.controls.orderDetails.controls[index].value
    this.httpService.callPost("updateOrder", order).subscribe(
      data => {
          this.orders[index] = data
          this.ordersForm.controls.orderDetails.controls[index].setValue(data)
      },
      error => {
        this.openModal('Errore', "La modifica dell'ordine non è riuscita")
      },
      () => {}
    )
  }

  compareShipper(a, b) {
     return a && b && a.id === b.id;
  }

  createForm(){
    this.ordersForm = this.formBuilder.group({
      orderDetails: this.formBuilder.array(
        this.orders.map(x => this.formBuilder.group({
          customerName: [x.customerName],
          employName: [x.employName],
          id: [x.id],
          orderDate: [x.orderDate, [Validators.required, Validators.pattern(this.datePattern)]],
          shipCity: [x.shipCity, [Validators.required]],
          shipAddress: [x.shipAddress, [Validators.required]],
          shipPostalCode: [x.shipPostalCode, [Validators.required]],
          shipCountry: [x.shipCountry, [Validators.required]],
          shipper: [x.shipper, [Validators.required]],
          products: this.formBuilder.array(
            x.products.map(y => this.formBuilder.group({
              quantity: [y.quantity, [Validators.required, Validators.pattern(this.numberPattern)]],
              name: [y.name],
              id: [y.id]
          })))
        }))
      )
    })
  }

  formInvalid(index){
     return this.ordersForm.controls.orderDetails.controls[index].pristine ||
     this.ordersForm.controls.orderDetails.controls[index].status === 'INVALID'
  }

  openModal(title, text){
    const initialState = {
      title: title,
      text: text
    }
    this.modalService.show(AlertModalComponent, {initialState})
  }

  createExcel() {
    this.spinner.show()
    setTimeout(() => {
      let excelData = {
        title: 'AAAAAAAAAAAAAAAAAAAAAA',
        data: [['colonna A','colonna b','colonna c']],
        headers: ['colonna A','colonnaB','colonnaC']
      }
      this.excelService.generateExcel(this.excelService.createExcel(excelData), 'bbbbbbbbbbbbbbbb').then(rs => {
        this.spinner.hide()
      })
    }, 10000)
  }

}

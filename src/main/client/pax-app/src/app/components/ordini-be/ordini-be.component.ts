import { Component, OnInit } from '@angular/core'
import { HttpService } from '../../services/http.service'
import { FormBuilder, Validators } from '@angular/forms'
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { ExcelService } from '../../services/excel.service'
import { NgxSpinnerService } from "ngx-spinner"

@Component({
  selector: 'app-ordini-be',
  templateUrl: './ordini-be.component.html',
  styleUrls: ['./ordini-be.component.css']
})
export class OrdiniBeComponent implements OnInit {

  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private modalService: BsModalService,
    public excelService: ExcelService, private spinner: NgxSpinnerService) {
    setInterval(() => {
      this.siteColor = localStorage.getItem("siteColor")
    }, 10)

    this.ordersForm = this.formBuilder.group({
      orderDetails: this.formBuilder.array([]),
      orderFilters: this.formBuilder.group(this.orderObj)
    })
  }

  ordersForm: any
  orders: any = []
  cities: any = []
  shippers: any = []
  filterColumns: any = ['orderDate', 'shipCity', 'shipAddress', 'shipPostalCode', 'shipCountry', 'shipper']
  start = 0
  end = 10

  siteColor: string
  fontSize = 14

  currentPage = 1
  maxSizePagination = 8
  totalItems = 0
  itemsPerPage = 10

  role = localStorage.getItem('userRole')
  datePattern = /^[\d]{4}-[\d]{2}-[\d]{2}$/
  numberPattern = /^[\d]*$/
  orderObj = { orderDate: [null, [Validators.pattern(this.datePattern)]], shipCity: '', shipAddress: '', shipPostalCode: '', shipCountry: '', shipper: '' }

  ngOnInit(): void {
    this.getOrdersByFilter(null)
    this.getTotalOrders()
    this.getShippers()
  }

  findPlaceHolder(field: string) {
    if (field === 'orderDate') {
      return 'yyyy-mm-dd'
    }
  }

  applyFilters() {
    let filters = {}
    for (var i = 0; i < this.filterColumns.length; i++) {
      filters[this.filterColumns[i]] = this.ordersForm.controls.orderFilters.controls[this.filterColumns[i]].value
    }
    this.getOrdersByFilter(filters)
  }

  resetFilters() {
    this.ordersForm.controls.orderFilters.reset()
    this.getOrdersByFilter(null)
  }

  setPageActive(event: any): void {
    this.currentPage = event && event.page ? event.page : (this.currentPage || 1)
    this.start = (this.currentPage - 1) * this.itemsPerPage
    this.end = this.currentPage * this.itemsPerPage
    this.getOrdersByFilter(null)
  }

  getOrdersByFilter(filters: any) {
    if (!filters) filters = {}
    filters.start = this.start
    this.httpService.callPost('ordersByRangeBE', filters).subscribe(
      data => {
        this.orders = data
        this.createForm()
        let cities = []
        for (let i = 0; i < this.orders.length; i++) {
          if (!cities.includes(this.orders[i].shipCity)) {
            cities.push(this.orders[i].shipCity)
          }
        }
        this.cities = cities
      },
      error => { },
      () => { }
    )
  }

  getTotalOrders() {
    this.httpService.callGet('ordersCount').subscribe(
      data => {
        this.totalItems = data as number
      },
      error => { },
      () => { }
    )
  }

  getShippers() {
    this.httpService.callGet('getShippers').subscribe(
      data => {
        this.shippers = data
      },
      error => { },
      () => { }
    )
  }

  modifyOrder(order: any) {
    order.inModifica = true
  }

  cancelModOrder(index: number) {
    delete this.orders[index].inModifica
    let x = this.orders[index]
    this.ordersForm.controls.orderDetails.controls[index].setValue({
      id: x.order.id,
      orderDate: x.order.orderDate,
      shipCity: x.order.shipCity,
      shipAddress: x.order.shipAddress,
      shipPostalCode: x.order.shipPostalCode,
      shipCountry: x.order.shipCountry,
      shipper: x.shipper,
      products: x.products
    })
  }

  saveOrder(index: number) {
    let order = this.ordersForm.controls.orderDetails.controls[index].value
    this.httpService.callPost("updateOrder", order).subscribe(
      data => {
        this.orders[index] = data
        this.ordersForm.controls.orderDetails.controls[index].setValue(data)
      },
      error => {
        this.openModal('Errore', "La modifica dell'ordine non è riuscita")
      },
      () => { }
    )
  }

  compareShipper(a: any, b: any) {
    return a && b && a.id === b.id;
  }

  createForm() {
    this.ordersForm.controls.orderDetails = this.formBuilder.array(
      this.orders.map(x => this.formBuilder.group({
        id: [x.order.id],
        orderDate: [x.order.orderDate, [Validators.required, Validators.pattern(this.datePattern)]],
        shipCity: [x.order.shipCity, [Validators.required]],
        shipAddress: [x.order.shipAddress, [Validators.required]],
        shipPostalCode: [x.order.shipPostalCode, [Validators.required]],
        shipCountry: [x.order.shipCountry, [Validators.required]],
        shipper: [x.shipper, [Validators.required]],
        products: x.products && this.formBuilder.array(
          x.products.map(y => this.formBuilder.group({
            //quantity: [y.quantity, [Validators.required, Validators.pattern(this.numberPattern)]],
            unitPrice: [y.unitPrice, [Validators.required]],
            name: [y.name],
            id: [y.id]
          })))
      }))
    )
  }

  formInvalid(index: number) {
    return this.ordersForm.controls.orderDetails.controls[index].pristine ||
      this.ordersForm.controls.orderDetails.controls[index].status === 'INVALID'
  }

  filterInvalid() {
    return this.ordersForm.controls.orderFilters.pristine ||
      this.ordersForm.controls.orderFilters.status === 'INVALID'
  }

  openModal(title: string, text: string) {
    const initialState = {
      title: title,
      text: text
    }
    this.modalService.show(AlertModalComponent, { initialState })
  }

  createExcel() {
    this.spinner.show()
    setTimeout(() => {
      let excelData = []
      for (var i = 0; i < this.orders.length; i++) {
        let order = this.orders[i]
        let orderData = [order.orderDate, order.shipCity, order.shipAddress,
        order.shipPostalCode, order.shipCountry, order.shipper.companyName + " " + order.shipper.phone]
        let products = []
        for (var j = 0; j < order.products.length; j++) {
          let product = order.products[j]
          products.push(product.quantity + " " + product.name)
        }
        orderData.push(products.join(", "))
        excelData.push(orderData)
      }
      let excelParams = {
        title: 'Ordini',
        data: excelData,
        headers: ['Customer name', 'Order date', 'Ship city', 'Ship address',
          'Ship postal code', 'Ship country', 'Shipping company', 'Products']
      }
      this.excelService.generateExcel(this.excelService.createExcel(excelParams), 'Ordini').then(rs => {
        this.spinner.hide()
      })
    }, 1000)
  }

}

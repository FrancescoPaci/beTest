import { Component, OnInit } from '@angular/core'
import { HttpService } from '../../services/http.service'
import { FormBuilder, Validators } from '@angular/forms'
import { ExcelService } from '../../services/excel.service'
import { NgxSpinnerService } from "ngx-spinner"

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.css']
})
export class OrdiniComponent implements OnInit {

  constructor(private httpService: HttpService, private formBuilder: FormBuilder,
    public excelService: ExcelService, private spinner: NgxSpinnerService) {
    setInterval(() => {
      this.siteColor = sessionStorage.getItem("siteColor")
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

  siteColor: string
  fontSize = 14

  page = 1
  maxSizePagination = 8
  totalItems = 0
  itemsPerPage = 10

  role = sessionStorage.getItem('userRole')
  datePattern = /^[\d]{4}-[\d]{2}-[\d]{2}$/
  numberPattern = /^[\d]*$/
  orderObj = { orderDate: [null, [Validators.pattern(this.datePattern)]], shipCity: '', shipAddress: '', shipPostalCode: '', shipCountry: '', shipper: '' }

  ngOnInit(): void {
    this.getOrdersByFilter(true)
    this.getShippers()
  }

  findPlaceHolder(field: string) {
    if (field === 'orderDate') {
      return 'yyyy-mm-dd'
    }
  }

  applyFilters() {
    this.page = 1
    this.getOrdersByFilter(true)
  }

  getOrdersByFilter(makeCount) {
    let filters = { page: this.page, size: this.itemsPerPage }
    for (var i = 0; i < this.filterColumns.length; i++) {
      filters[this.filterColumns[i]] = this.ordersForm.controls.orderFilters.controls[this.filterColumns[i]].value
    }
    if (makeCount) {
      this.getTotalOrders(filters)
    }
    this.httpService.callPost('jpa/ordersByRange', filters, "L'ordinamento non è riuscito.").subscribe(
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

  getTotalOrders(filters: any) {
    this.httpService.callPost('jpa/ordersCount', filters, "Non è stato possibile recuperare il numero totale degli ordini").subscribe(
      data => {
        this.totalItems = data as number
      },
      error => { },
      () => { }
    )
  }

  resetFilters() {
    this.ordersForm.controls.orderFilters.reset()
    this.getOrdersByFilter(true)
  }

  setPageActive(event: any): void {
    this.page = event && event.page ? event.page : (this.page || 1)
    this.start = (this.page - 1) * this.itemsPerPage
    this.getOrdersByFilter(false)
  }

  getShippers() {
    this.httpService.callGet('jpa/getShippers', "Errore nel reperimento degli shippers").subscribe(
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
    this.fromOrderDtoToFormOrder(this.orders[index], index)
  }

  fromOrderDtoToFormOrder(order, index) {
    this.ordersForm.controls.orderDetails.controls[index].setValue({
      id: order.id,
      orderDate: order.orderDate,
      shipCity: order.shipCity,
      shipAddress: order.shipAddress,
      shipPostalCode: order.shipPostalCode,
      shipCountry: order.shipCountry,
      shipper: order.shipper,
      orderDetails: order.orderDetails
    })
  }

  saveOrder(index: number) {
    var formOrder = this.ordersForm.controls.orderDetails.controls[index].value
    this.httpService.callPost("jpa/updateOrder", formOrder, "La modifica dell'ordine non è riuscita.").subscribe(
      data => {
        this.orders[index] = formOrder
      },
      error => { },
      () => { }
    )
  }

  compareShipper(a: any, b: any) {
    return a && b && a.id === b.id;
  }

  createForm() {
    this.ordersForm.controls.orderDetails = this.formBuilder.array(
      this.orders.map(x => this.formBuilder.group({
        id: [x.id],
        orderDate: [x.orderDate, [Validators.required, Validators.pattern(this.datePattern)]],
        shipCity: [x.shipCity, [Validators.required]],
        shipAddress: [x.shipAddress, [Validators.required]],
        shipPostalCode: [x.shipPostalCode, [Validators.required]],
        shipCountry: [x.shipCountry, [Validators.required]],
        shipper: [x.shipper, [Validators.required]],
        orderDetails: x.orderDetails && this.formBuilder.array(
          x.orderDetails.map(y => this.formBuilder.group({
            id: [y.id],
            order: [y.order],
            quantity: [y.quantity, [Validators.required]],
            discount: [y.discount],
            product: [y.product]
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

  createExcel() {
    this.spinner.show()
    setTimeout(() => {
      let excelData = []
      for (var i = 0; i < this.orders.length; i++) {
        let order = this.orders[i]
        let orderData = [order.orderDate, order.shipCity, order.shipAddress,
        order.shipPostalCode, order.shipCountry, order.shipper.companyName + " " + order.shipper.phone, JSON.stringify(order.orderDetails)]
        excelData.push(orderData)
      }
      let excelParams = {
        title: 'Ordini',
        data: excelData,
        headers: ['Customer name', 'Order date', 'Ship city', 'Ship address',
          'Ship postal code', 'Ship country', 'Shipping company', 'Order details']
      }
      this.excelService.generateExcel(this.excelService.createExcel(excelParams), 'Ordini').then(rs => {
        this.spinner.hide()
      })
    }, 1000)
  }

}

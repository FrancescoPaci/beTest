import { Component, OnInit } from '@angular/core'
import { HttpService } from '../../services/http.service'
import { FormBuilder, Validators } from '@angular/forms'
import { ExcelService } from '../../services/excel.service'
import { NgxSpinnerService } from "ngx-spinner"

@Component({
  selector: 'app-ordini-be',
  templateUrl: './ordini-be.component.html',
  styleUrls: ['./ordini-be.component.css']
})
export class OrdiniBeComponent implements OnInit {

  constructor(private httpService: HttpService, private formBuilder: FormBuilder,
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
    this.getFilters()
    this.getOrdersByFilter()
    this.getShippers()
  }

  findPlaceHolder(field: string) {
    if (field === 'orderDate') {
      return 'yyyy-mm-dd'
    }
  }

  applyFilters() {
    this.start = 0
    this.currentPage = 1
    this.getOrdersByFilter()
  }

  getOrdersByFilter() {
    let filters = { start: this.start }
    for (var i = 0; i < this.filterColumns.length; i++) {
      filters[this.filterColumns[i]] = this.ordersForm.controls.orderFilters.controls[this.filterColumns[i]].value
    }
    this.getTotalOrders(filters)
    this.httpService.callPost('mybatis/ordersByRange', filters, "L'ordinamento non è riuscito.").subscribe(
      data => {
        this.orders = data
        this.createForm()
        let cities = []
        for (let i = 0; i < this.orders.length; i++) {
          if (!cities.includes(this.orders[i].order.shipCity)) {
            cities.push(this.orders[i].order.shipCity)
          }
        }
        this.cities = cities
      },
      error => { },
      () => { }
    )
  }

  getTotalOrders(filters: any) {
    this.httpService.callPost('mybatis/ordersCount', filters, "Non è stato possibile recuperare il numero totale degli ordini").subscribe(
      data => {
        this.totalItems = data as number
      },
      error => { },
      () => { }
    )
  }

  resetFilters() {
    this.ordersForm.controls.orderFilters.reset()
    this.getOrdersByFilter()
  }

  setPageActive(event: any): void {
    this.currentPage = event && event.page ? event.page : (this.currentPage || 1)
    this.start = (this.currentPage - 1) * this.itemsPerPage
    this.getOrdersByFilter()
  }

  getShippers() {
    this.httpService.callGet('mybatis/getShippers', "Errore nel reperimento degli shippers").subscribe(
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

  fromOrderDtoToFormOrder(orderDto, index) {
    this.ordersForm.controls.orderDetails.controls[index].setValue({
      id: orderDto.order.id,
      orderDate: orderDto.order.orderDate,
      shipCity: orderDto.order.shipCity,
      shipAddress: orderDto.order.shipAddress,
      shipPostalCode: orderDto.order.shipPostalCode,
      shipCountry: orderDto.order.shipCountry,
      shipper: orderDto.shipper,
      products: orderDto.products
    })
  }

  saveOrder(index: number) {
    let formOrder = this.ordersForm.controls.orderDetails.controls[index].value
    let orderDto = {
      order: {
        id: formOrder.id,
        orderDate: formOrder.orderDate,
        shipCity: formOrder.shipCity,
        shipperId: formOrder.shipper.id,
        shipAddress: formOrder.shipAddress,
        shipPostalCode: formOrder.shipPostalCode,
        shipCountry: formOrder.shipCountry
      },
      shipper: formOrder.shipper,
      products: formOrder.products
    }
    this.httpService.callPost("mybatis/updateOrder", orderDto, "La modifica dell'ordine non è riuscita.").subscribe(
      data => {
        this.orders[index] = orderDto
        this.fromOrderDtoToFormOrder(orderDto, index)
      },
      error => { },
      () => { }
    )
  }

  getFilters() { //this method is never used is just a try
    this.httpService.callGet("mybatis/selectDistinct", "Errore nel reperimento dei filtri").subscribe(
      data => {
        let filters = data
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
        id: [x.order.id],
        orderDate: [x.order.orderDate, [Validators.required, Validators.pattern(this.datePattern)]],
        shipCity: [x.order.shipCity, [Validators.required]],
        shipAddress: [x.order.shipAddress, [Validators.required]],
        shipPostalCode: [x.order.shipPostalCode, [Validators.required]],
        shipCountry: [x.order.shipCountry, [Validators.required]],
        shipper: [x.shipper, [Validators.required]],
        products: x.products && this.formBuilder.array(
          x.products.map(y => this.formBuilder.group({
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

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
      this.siteColor = localStorage.getItem("siteColor")
    }, 10)

    this.ordersForm = this.formBuilder.group({
      orderDetails: this.formBuilder.array([]),
      orderFilters: this.formBuilder.group(this.orderObj)
    })
  }

  ordersForm
  orders: any = []
  ordersFiltered: any = []
  cities: any = []
  shippers: any = []
  filterColumns: any = ['customerName', 'orderDate', 'shipCity', 'shipAddress', 'shipPostalCode', 'shipCountry', 'shipper']
  orderObj = { customerName: '', orderDate: '', shipCity: '', shipAddress: '', shipPostalCode: '', shipCountry: '', shipper: '' }
  start = 0
  end = 10

  siteColor
  fontSize = 14

  currentPage = 1
  maxSizePagination = 8
  totalItems = 0
  itemsPerPage = 10

  role = localStorage.getItem('userRole')
  datePattern = /^[\d]{4}-[\d]{2}-[\d]{2}$/
  numberPattern = /^[\d]*$/

  ngOnInit(): void {
    this.getOrders()
    this.getTotalOrders()
    this.getShippers()
  }

  applyFilters() {
    let filters = {}
    for (var i = 0; i < this.filterColumns.length; i++) {
      filters[this.filterColumns[i]] = this.ordersForm.controls.orderFilters.controls[this.filterColumns[i]].value
    }
    this.ordersFiltered = this.orders.filter(function (o) {
      for (var key in filters) {
        if (filters[key] && o[key]) {
          if (key === 'shipper') {
            if (o[key].name.toLowerCase().indexOf(filters[key].toLowerCase()) === -1) {
              return false
            }
          } else if (o[key].toLowerCase().indexOf(filters[key].toLowerCase()) === -1) {
            return false
          }
        }
      }
      return true
    })
  }

  resetFilters() {
    this.ordersForm.controls.orderFilters.setValue(this.orderObj)
    this.ordersFiltered = this.orders
  }

  setPageActive(event: any, setData): void {
    this.currentPage = event && event.page ? event.page : (this.currentPage || 1)
    this.start = (this.currentPage - 1) * this.itemsPerPage + 1
    this.end = this.currentPage * this.itemsPerPage
    this.getOrders()
  }

  getOrders() {
    let params = '?start=' + this.start + '&end=' + this.end
    this.httpService.callGet('ordersByRange' + params, "Errore nel reperimento degli ordini").subscribe(
      data => {
        this.orders = data
        this.ordersFiltered = data
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
    this.httpService.callGet('ordersCount', "Errore nel reperimento del numero totale di ordini necessario per l'impaginazione").subscribe(
      data => {
        this.totalItems = data as number
      },
      error => { },
      () => { }
    )
  }

  getShippers() {
    this.httpService.callGet('getShippers', "Errore nel reperimento degli shippers").subscribe(
      data => {
        this.shippers = data
      },
      error => { },
      () => { }
    )
  }

  modifyOrder(order) {
    order.inModifica = true
  }

  cancelModOrder(index) {
    delete this.orders[index].inModifica
    this.ordersForm.controls.orderDetails.controls[index].setValue(JSON.parse(JSON.stringify(this.orders[index])))
  }

  saveOrder(index) {
    let order = this.ordersForm.controls.orderDetails.controls[index].value
    this.httpService.callPost("updateOrder", order, "Il salvataggio dell'ordine non è riuscito").subscribe(
      data => {
        this.ordersFiltered[index] = data
        this.ordersForm.controls.orderDetails.controls[index].setValue(data)
      },
      error => { },
      () => { }
    )
  }

  compareShipper(a, b) {
    return a && b && a.id === b.id;
  }

  createForm() {
    this.ordersForm.controls.orderDetails = this.formBuilder.array(
      this.orders.map(x => this.formBuilder.group({
        customerName: [x.customerName],
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
  }

  formInvalid(index) {
    return this.ordersForm.controls.orderDetails.controls[index].pristine ||
      this.ordersForm.controls.orderDetails.controls[index].status === 'INVALID'
  }

  createExcel() {
    this.spinner.show()
    setTimeout(() => {
      let excelData = []
      for (var i = 0; i < this.orders.length; i++) {
        let order = this.orders[i]
        let orderData = [order.customerName, order.orderDate, order.shipCity, order.shipAddress,
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

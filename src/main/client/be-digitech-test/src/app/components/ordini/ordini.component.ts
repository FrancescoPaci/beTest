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
      orderDetails: this.formBuilder.array([]),
      orderFilters: this.formBuilder.group(this.orderObj)
    })
  }

  ordersForm
  orders: any = []
  ordersFiltered: any = []
  cities: any = []
  shippers: any = []
  ordersColumns: any = ['customerName','orderDate','shipCity','shipAddress','shipPostalCode','shipCountry']
  orderObj = {customerName: '', orderDate: '', shipCity: '', shipAddress: '', shipPostalCode: '', shipCountry: ''}
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

  applyFilters(){
    let filter = {
       customerName : this.ordersForm.controls.orderFilters.controls['customerName'].value,
       orderDate : this.ordersForm.controls.orderFilters.controls['orderDate'].value,
       shipCity : this.ordersForm.controls.orderFilters.controls['shipCity'].value,
       shipAddress : this.ordersForm.controls.orderFilters.controls['shipAddress'].value,
       shipPostalCode : this.ordersForm.controls.orderFilters.controls['shipPostalCode'].value,
       shipCountry : this.ordersForm.controls.orderFilters.controls['shipCountry'].value
    }
    let filtered = this.orders.filter(function(o){
      return ((filter.customerName && o.customerName.toLowerCase().indexOf(filter.customerName.toLowerCase()) >= 0) ||
             (filter.orderDate && o.orderDate.toLowerCase().indexOf(filter.orderDate.toLowerCase()) >= 0) ||
             (filter.shipCity && o.shipCity.toLowerCase().indexOf(filter.shipCity.toLowerCase()) >= 0) ||
             (filter.shipAddress && o.shipAddress.toLowerCase().indexOf(filter.shipAddress.toLowerCase()) >= 0) ||
             (filter.shipPostalCode && o.shipPostalCode.toLowerCase().indexOf(filter.shipPostalCode.toLowerCase()) >= 0) ||
             (filter.shipCountry && o.shipCountry.toLowerCase().indexOf(filter.shipCountry.toLowerCase()) >= 0))
    })
    this.ordersFiltered = filtered.length > 0 ? filtered : this.orders
  }

  resetFilters(){
    this.ordersForm.controls.orderFilters.setValue(this.orderObj)
    this.ordersFiltered = this.orders
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
        this.ordersFiltered = data
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
          this.ordersFiltered[index] = data
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
      let excelData = []
      for(var i = 0; i < this.orders.length; i++){
        let order = this.orders[i]
        let orderData = [order.customerName, order.orderDate, order.shipCity, order.shipAddress,
                  order.shipPostalCode, order.shipCountry, order.shipper.companyName + " " + order.shipper.phone]
        let products = []
        for(var j = 0; j < order.products.length; j++){
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

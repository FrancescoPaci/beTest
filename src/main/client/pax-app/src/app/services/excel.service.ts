import { Injectable } from '@angular/core'
import { Workbook } from 'exceljs'
import * as fs from 'file-saver'
import * as Excel from 'exceljs/dist/exceljs.min.js'

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  createExcel(excelData) {

    let title = excelData.title
    let header = excelData.headers
    let data = excelData.data

    let workbook = new Excel.Workbook()
    let worksheet = workbook.addWorksheet('Sheet1')

    worksheet.mergeCells('A1', String.fromCharCode(97 + header.length - 1).toUpperCase() + '2')
    let titleRow = worksheet.getCell('A1')
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 13,
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    let headerRow = worksheet.addRow(header)
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    data.forEach(d => {
      worksheet.addRow(d)
    })

    for (let i = 0; i < header.length; i++) {
      worksheet.columns[i].width = header[i].length * 1.5
    }

    return workbook
  }

  generateExcel(workbook, title) {
    return workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      fs.saveAs(blob, title + '.xlsx')
    })
  }

}

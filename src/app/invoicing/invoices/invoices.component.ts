import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  invoiceCols: any[] = [];
  invoices: any[] = [];
  selectedInvoices: any[] = [];
  invoiceTypes: any[] = [{ name: 'Purchase', code: 'P' }, { name: 'Sales', code: 'S' }];
  invoiceType: any = { name: 'Purchase', code: 'P' };

  constructor() { }

  ngOnInit(): void {
    this.invoiceCols = [
      { field: 'invoiceNo', header: 'Invoice No.' },
      { field: 'orderNo', header: 'Order No.' },
      { field: 'vendor', header: 'Vendor' },
      { field: 'status', header: 'Status' },
      { field: 'type', header: 'Type' },
      { field: 'amount', header: 'Amount' },
      { field: 'invoiceDate', header: 'Invoice Date' },
      { field: 'paymentOutstanding', header: 'Payment Outstanding' },
    ];

    this.invoices = [
      {
        invoiceNo: '1000001',
        orderNo: '',
        vendor: 'Ramesh',
        status: 'DRAFT',
        type: 'PROFORMA',
        amount: '43000',
        invoiceDate: '12-08-2022',
        paymentOutstanding: '37000'
      },
      {
        invoiceNo: '1000002',
        orderNo: '',
        vendor: 'Prism',
        status: 'APPROVED',
        type: 'FINAL',
        amount: '13000',
        invoiceDate: '05-08-2022',
        paymentOutstanding: '7000'
      },
      {
        invoiceNo: '1000004',
        orderNo: '',
        vendor: 'Raghu',
        status: 'DRAFT',
        type: 'RECURRING',
        amount: '133000',
        invoiceDate: '10-08-2022',
        paymentOutstanding: '133000'
      }
    ]
  }

}

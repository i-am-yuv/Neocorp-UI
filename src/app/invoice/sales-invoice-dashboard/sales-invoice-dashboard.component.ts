import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InvoiceService } from '../invoice.service';
import { SalesInvoice } from '../invoice-model';


@Component({
  selector: 'app-sales-invoice-dashboard',
  templateUrl: './sales-invoice-dashboard.component.html',
  styleUrls: ['./sales-invoice-dashboard.component.scss']
})
export class SalesInvoiceDashboardComponent implements OnInit {

  submitted: boolean = false;

  allSIs: any[] = [];
  totalRecords: number = 0;

  activeInvoice: SalesInvoice = {};
  lineitems: any[] = [];
  siSubTotal: number = 0;

  currentDue : number = 0 ;
  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private invoiceS: InvoiceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.items = [{label: 'Invoices'},{ label: 'Sales Invoices', routerLink: ['/invoice/salesInvoices'] }, {label: 'Dashboard'} ];

    this.loadSI();
  }

  loadSI() {
    this.submitted = true;
    this.invoiceS.getAllSI().then(
      (res: any) => {
        console.log(res);
        this.allSIs = res.content;
        if (this.allSIs.length > 0) {
          this.changeOrder(this.allSIs[0]);
        } else {
          this.activeInvoice = {};
        }
        this.totalRecords = res.totalElements;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  changeOrder(si: SalesInvoice) {
    this.activeInvoice = si;
    this.getOrderLines(si);
    this.getRemainingAmount(si);
  }

  getOrderLines(invoice: SalesInvoice) {
    this.submitted = true;
    this.invoiceS
      .getLineitemsBySI(invoice)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.submitted = false;
          this.siSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
        }
        this.submitted = false;
      });

  }

  CreateNewSI() {
    this.router.navigate(['/invoice/salesInvoice/create']);
  }

  onEditSI(id: string) {
    this.router.navigate(['/invoice/salesInvoice/edit/' + id]);
  }

  getRemainingAmount(SI:any)
  {
    this.submitted  = true;
    this.currentDue = SI.remainingAmount;
    // this.invoiceS.getRemainingAmount(SI).then(
    //   (res)=>{
    //         console.log(res);
    //         this.currentDue = res;
    //         this.submitted  = false;
    //   }
    // ).catch(
    //   (err)=>{
    //      console.log(err);
    //      this.submitted  = false;
    //   }
    // )
  }


  myFunction(item: any): string {
     return parseFloat(item).toFixed(2);
  }


}
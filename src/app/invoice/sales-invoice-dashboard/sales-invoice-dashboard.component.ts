import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private invoiceS: InvoiceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadSI();
  }

  loadSI() {
    this.submitted = true;
    this.invoiceS.getAllSI().then(
      (res: any) => {
        console.log(res);
        this.allSIs = res.content;
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
    this.invoiceS.getRemainingAmount(SI).then(
      (res)=>{
            console.log(res);
            this.currentDue = res;
            this.submitted  = false;
      }
    ).catch(
      (err)=>{
         console.log(err);
         this.submitted  = false;
      }
    )
  }


}
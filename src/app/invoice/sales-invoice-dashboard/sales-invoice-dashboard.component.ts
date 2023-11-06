import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InvoiceService } from '../invoice.service';
import { SalesInvoice } from '../invoice-model';
import { AuthService } from 'src/app/auth/auth.service';


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
    private authS : AuthService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.items = [{label: 'Invoices'},{ label: 'Sales Invoices', routerLink: ['/invoice/salesInvoices'] }, {label: 'Dashboard'} ];

    this.loadUser();
    
  }

  loadSI() {
    this.submitted = true;
    this.invoiceS.getAllSI(this.currentUser).then(
      (res: any) => {
        console.log(res);
        this.allSIs = res;
        if (this.allSIs.length > 0) {
          this.changeOrder(this.allSIs[0]);
        } else {
          this.activeInvoice = {};
        }
        this.totalRecords = res.length;
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
    //this.getRemainingAmount(si);
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

  // getRemainingAmount(SI:any)
  // {
  //   this.submitted  = true;
  //   this.currentDue = SI.remainingAmount;
  //   // this.invoiceS.getRemainingAmount(SI).then(
  //   //   (res)=>{
  //   //         console.log(res);
  //   //         this.currentDue = res;
  //   //         this.submitted  = false;
  //   //   }
  //   // ).catch(
  //   //   (err)=>{
  //   //      console.log(err);
  //   //      this.submitted  = false;
  //   //   }
  //   // )
  // }


  myFunction(item: any): string {
    if( item == null )
    {
      return '0.00';
    }
     return parseFloat(item).toFixed(2);
  }

  
  searchSI: any;
  searchSIs(value: any) {
    if (value === null) {
      //alert(value);
      this.loadSI();
    }
    else{
     // this.submitted = true;
      this.invoiceS.searchSI(value).then(
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
          this.submitted = false;
        }
      )
    }
  }

  currentUser : any = {};
  currentCompany : any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentUser = res;
      this.currentCompany = res.comapny;
      this.submitted = false;

      this.loadSI();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

}
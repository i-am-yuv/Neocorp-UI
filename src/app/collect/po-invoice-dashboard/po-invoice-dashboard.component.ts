import { Component, OnInit } from '@angular/core';
import { PurchaseInvoice } from '../collect-models';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { CollectService } from '../collect.service';
import { PayPageService } from 'src/app/pay/pay-page.service';

@Component({
  selector: 'app-po-invoice-dashboard',
  templateUrl: './po-invoice-dashboard.component.html',
  styleUrls: ['./po-invoice-dashboard.component.scss']
})
export class PoInvoiceDashboardComponent implements OnInit {

  submitted: boolean = false;
  currPIRemainingAmount : number = 0 ;

  allPIs: any[] = [];
  totalRecords: number = 0;

  activeInvoice: PurchaseInvoice = {};
  lineitems: any[] = [];
  piSubTotal: number = 0;

  currentDue: number = 0;

  items!: MenuItem[];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private collectS: CollectService,
    private confirmationService: ConfirmationService,
    private payServices : PayPageService) { }

  ngOnInit(): void {
    this.items = [{label: 'Bills'},{ label: 'Purchase Invoices', routerLink: ['/collect/purchaseInvoices'] }, { label: 'Dashboard'}];

    this.loadPI();
    this.currentDue = 0;
  }

  loadPI() {
    this.submitted = true;
    this.collectS.allPurchaseInvoice().then(
      (res: any) => {
        console.log(res);
        this.allPIs = res.content;
        if (this.allPIs.length > 0) {
          this.changeOrder(this.allPIs[0]);
        } else {
          this.activeInvoice = {};
        }
        this.totalRecords = res.totalElements;
        for (const purchaseInvoice of this.allPIs) {
  
          this.collectS.getRemainingAmount(purchaseInvoice).then(
            (res) => {
              this.allPIs.find((invoice) => invoice.id === purchaseInvoice.id).remainingAmount = res;
               console.log(res);
               this.currPIRemainingAmount = res;
            }
          ).catch(
            (err) => {
              console.log(err);
            }
          )
        }
        this.submitted = false;
      }
    ).catch(
      (err) => {
        this.submitted = false;
        console.log(err);
      }
    )

  }

  changeOrder(pi: PurchaseInvoice) {
    this.currentDue = 0;
    this.activeInvoice = pi;
    this.getOrderLines(pi);
    this.getRemainingAmount(pi);
  }

  getOrderLines(invoice: PurchaseInvoice) {
    this.submitted = true;
    this.collectS
      .getPurchaseLineItemsByInvoice(invoice)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.submitted = false;
          this.piSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
        }
        this.submitted = false;
      });

  }

  CreateNewPI() {
    this.router.navigate(['/collect/purchaseInvoice/create']);
  }

  onEditPI(id: string) {
    this.router.navigate(['/collect/purchaseInvoice/edit/' + id]);
  }

  getRemainingAmount(PI: any) {
    this.submitted = true;
    this.collectS.getRemainingAmount(PI).then(
      (res) => {
        console.log(res);
        this.currentDue = res;
        this.currPIRemainingAmount = res;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  togglePartialPayment(invoiceId : any , bol : boolean)
  {
       this.collectS.togglePartialPaymentStatus(invoiceId , bol).then(
        (res)=>{

          console.log(res);
          if( bol == true )
          {
            this.message.add({
              severity: 'success',
              summary: 'success',
              detail: 'Partial Payment Enabled Successfully',
              life: 3000,
            });
          }
          else{
            this.message.add({
              severity: 'success',
              summary: 'success',
              detail: 'Partial Payment Disabled Successfully',
              life: 3000,
            });
          }
          //this.router.navigate(['/collect/purchaseInvoices' ]);
          this.ngOnInit();
        }
       ).catch(
        (err)=>{
          console.log(err);
        }
       )
  }
  myFunction(item: any): string {
    return parseFloat(item).toFixed(2);
  }

  searchPI: any;
  searchPIs(value: any) {
    if (value === null) {
      //alert(value);
      this.loadPI();
    }
    else{
     // this.submitted = true;
      this.payServices.searchPI(value).then(
        (res: any) => {
          console.log(res);
          this.allPIs = res.content;
          if (this.allPIs.length > 0) {
            this.changeOrder(this.allPIs[0]);
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

}
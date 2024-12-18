import { Component, OnInit } from '@angular/core';
import { PurchaseInvoice } from '../collect-models';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { CollectService } from '../collect.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';


@Component({
  selector: 'app-po-invoice-dashboard',
  templateUrl: './po-invoice-dashboard.component.html',
  styleUrls: ['./po-invoice-dashboard.component.scss']
})
export class PoInvoiceDashboardComponent implements OnInit {

  submitted: boolean = false;

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
    private collectS: CollectService,
    private payServices: PayPageService,
    private authS: AuthService, private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadCrumbService.breadCrumb([{ label: 'Purchase Invoices', routerLink: ['/collect/purchaseInvoices'] }, { label: 'Dashboard' }]);

    this.currentDue = 0;
    this.loadUser();
  }

  loadPI() {
    this.submitted = true;
    this.collectS.allPurchaseInvoice(this.currentUser).then((res: any) => {
      console.log(res);
      this.allPIs = res;

      if (this.allPIs.length > 0) {
        this.changeOrder(this.allPIs[0]);
      } else {
        this.activeInvoice = {};
      }

      this.totalRecords = res.length;
      this.submitted = false;
    }
    )
      .catch(
        (err) => {
          this.submitted = false;
          console.log(err);
        }
      )

  }

  changeOrder(pi: PurchaseInvoice) {

    // Here we are loading all the details again for this active Invoice

    this.submitted = true;
      this.collectS.getPurchaseInvoiceById(pi.id).then(
        (purchaseInvoice: PurchaseInvoice) => {
          purchaseInvoice.duedate = purchaseInvoice.duedate ? new Date(purchaseInvoice.duedate) : undefined;
          purchaseInvoice.invoiceDate = purchaseInvoice.invoiceDate ? new Date(purchaseInvoice.invoiceDate) : undefined;

          this.activeInvoice = purchaseInvoice;
          this.currentDue = 0;
          this.activeInvoice = purchaseInvoice;
          this.getOrderLines(purchaseInvoice);
          this.submitted = false;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail:'Error while fetching the invoice details',
            life: 3000,
          });
        }
      )


    // this.currentDue = 0;
    // this.activeInvoice = pi;
    // this.getOrderLines(pi);
    
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

  togglePartialPayment(invoiceId: any, bol: boolean) {
    this.collectS.togglePartialPaymentStatus(invoiceId, bol).then(
      (res) => {

        console.log(res);
        if (bol == true) {
          this.message.add({
            severity: 'success',
            summary: 'success',
            detail: 'Partial Payment Enabled Successfully',
            life: 3000,
          });
        }
        else {
          this.message.add({
            severity: 'success',
            summary: 'success',
            detail: 'Partial Payment Disabled Successfully',
            life: 3000,
          });
        }
        //this.router.navigate(['/collect/purchaseInvoices' ]);
       // this.ngOnInit();
        this.changeOrder(this.activeInvoice);
      }
    ).catch(
      (err) => {
        console.log(err);
        if (bol == true) {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while Partial Payment Enabled',
            life: 3000,
          });
        }
        else {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error While Partial Payment Disabled',
            life: 3000,
          });
        }
      }
    )
  }
  myFunction(item: any): string {
     return parseFloat(item).toFixed(2);

  //   const parsedItem = parseFloat(item);
  // if (isNaN(parsedItem) || !isFinite(parsedItem)) {
  //   return '0'; 
  // }
  // return parsedItem.toFixed(2);
  }

  searchPI: any;
  searchPIs(value: any) {
    if (value === null) {
      //alert(value);
      this.loadPI();
    }
    else {
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

  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;
      this.loadPI();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

}
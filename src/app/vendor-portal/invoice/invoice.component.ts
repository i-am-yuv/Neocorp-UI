import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { PurchaseInvoice } from 'src/app/collect/collect-models';
import { CollectService } from 'src/app/collect/collect.service';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  submitted: boolean = false;

  allPIs: any[] = [];
  totalRecords: number = 0;

  activeInvoice: PurchaseInvoice = {};
  lineitems: any[] = [];
  piSubTotal: number = 0;

  items!: MenuItem[];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private vendorS: ServiceService,
    private collectS: CollectService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Vendor Portal' }, { label: 'Sales Invoices', routerLink: ['/vendorPortal/invoices'] }, { label: 'Dashboard' }];

    this.loadPIByVendor();
  }

  loadPIByVendor() {
    this.submitted = true;
    var vendorId = '7f000101-8b22-1cd7-818b-2287c165000c';
    this.vendorS.getAllPIByVendor(vendorId).then(
      (res: any) => {
        console.log(res);
        this.allPIs = res;
        if (this.allPIs.length > 0) {
          this.changeOrder(this.allPIs[0]);
        } else {
          this.activeInvoice = {};
        }
        this.totalRecords = res.length;
        // for (const purchaseInvoice of this.allPIs) {
        //   this.collectS.getRemainingAmount(purchaseInvoice).then(
        //     (res) => {
        //       this.allPIs.find((invoice) => invoice.id === purchaseInvoice.id).remainingAmount = res;
        //        console.log(res);
        //        //this.currPIRemainingAmount = res;
        //     }
        //   ).catch(
        //     (err) => {
        //       console.log(err);
        //     }
        //   )
        // }
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
    this.activeInvoice = pi;
    this.getOrderLines(pi);
    //this.getRemainingAmount(pi);
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

  // getRemainingAmount(PI: any) {
  //   this.submitted = true;
  //   this.collectS.getRemainingAmount(PI).then(
  //     (res) => {
  //       console.log(res);
  //       this.currentDue = res;
  //       this.currPIRemainingAmount = res;
  //       this.submitted = false;
  //     }
  //   ).catch(
  //     (err) => {
  //       console.log(err);
  //       this.submitted = false;
  //     }
  //   )
  // }

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
        // this.router.navigate(['/collect/purchaseInvoices' ]);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }
  myFunction(item: any): string {
    return parseFloat(item).toFixed(2);
  }
}

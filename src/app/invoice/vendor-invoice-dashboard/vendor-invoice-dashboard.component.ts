import { Component, OnInit } from '@angular/core';
import { VendorInvoice } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { InvoiceService } from '../invoice.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-vendor-invoice-dashboard',
  templateUrl: './vendor-invoice-dashboard.component.html',
  styleUrls: ['./vendor-invoice-dashboard.component.scss']
})
export class VendorInvoiceDashboardComponent implements OnInit {

  submitted: boolean = false;

  allVIs: any[] = [];
  totalRecords: number = 0;

  activeInvoice: VendorInvoice = {};
  lineitems: any[] = [];
  viSubTotal: number = 0;

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private invoiceS: InvoiceService,
    private confirmationService: ConfirmationService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Vendor Invoices', routerLink: ['/invoice/vendorInvoices'] }, { label: 'Dashboard' }]);

    this.loadUser();

  }

  loadVI() {
    this.submitted = true;
    this.invoiceS.getAllVI(this.currentUser).then(
      (res: any) => {
        console.log(res);
        this.allVIs = res;
        if (this.allVIs.length > 0) {
          this.changeOrder(this.allVIs[0]);
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

  changeOrder(vi: VendorInvoice) {
    this.activeInvoice = vi;
    this.getOrderLines(vi);
  }

  getOrderLines(invoice: VendorInvoice) {
    this.submitted = true;
    this.invoiceS
      .getLineitemsByVI(invoice)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.submitted = false;
          this.viSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
        }
        this.submitted = false;
      });

  }

  CreateNewVI() {
    this.router.navigate(['/invoice/vendorInvoice/create']);
  }

  onEditVI(id: string) {
    this.router.navigate(['/invoice/vendorInvoice/edit/' + id]);
  }


  searchVI: any;
  searchVIs(value: any) {
    if (value === null) {
      //alert(value);
      this.loadVI();
    }
    else {
      // this.submitted = true;
      this.invoiceS.searchVI(value).then(
        (res: any) => {
          console.log(res);
          this.allVIs = res.content;
          if (this.allVIs.length > 0) {
            this.changeOrder(this.allVIs[0]);
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

      this.loadVI();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }



}

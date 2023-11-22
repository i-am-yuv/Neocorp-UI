import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayPageService } from '../pay-page.service';
import { Vendor } from 'src/app/settings/customers/customer';
import { MenuItem, SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';
import { PurchaseInvoice } from 'src/app/collect/collect-models';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {

  submitted: boolean = false;
  totalRecord: number = 0;

  allVendors: any = [];
  allPurchaseOrders: any[] = []; // Vendor only have Purchase Orders
  allPurchaseInvoices: any[] = []; // Vendor only have Purchase Invoice

  activeVendor: Vendor = {};

  showOrders: boolean = true;
  showInvoices: boolean = false;

  totalRemainingAmount: number = 0;
  totalGrossAmount: number = 0.00;

  items!: MenuItem[];

  constructor(private router: Router, private route: ActivatedRoute,
    private payServices: PayPageService, private authS: AuthService, private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {

    this.breadCrumbService.breadCrumb([{ label: 'Vendors', routerLink: ['/pay/vendors'] }, { label: 'Dashboard' }]);

    this.loadUser();
    //  this.getAllVendors();
  }

  getAllVendors() {
    this.submitted = true;
    this.payServices.allVendor(this.currentUser).then((res: any) => {
      console.log(res);
      this.allVendors = res;
      if (this.allVendors.length > 0) {
        this.changeVender(this.allVendors[0]);
      } else {
        this.activeVendor = {};
      }
      this.totalRecord = res.totalElements;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  // Change the Active Vendor
  changeVender(vendor: Vendor) {
    this.refreshAll();
    this.activeVendor = vendor;
    this.getAllPurchageOrder(vendor);
    this.getAllPurchaseInvoice(vendor);
  }

  refreshAll() {
    this.allPurchaseOrders = []; // customer only have Purchase Orders
    this.allPurchaseInvoices = [];
    this.showOrders = true;
    this.showInvoices = false;
  }

  showOrdersPage() {
    this.showOrders = true;
    this.showInvoices = false;
  }

  showInvoicesPage(vendor: Vendor) {
    this.showInvoices = true;
    this.showOrders = false;

    this.submitted = true;
    this.payServices.getPurchaseInvoiceById(vendor).then((res: any) => {
      this.allPurchaseInvoices = res;
      this.submitted = false;
      this.totalRemainingAmount = 0;

      this.totalGrossAmount = this.allPurchaseInvoices
        .reduce((total, PI) =>
          total + PI.grossTotal, 0
        )
      this.totalRemainingAmount = this.allPurchaseInvoices
        .reduce((total, PI) =>
          total + PI.remainingAmount, 0
        )
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  // Getting all PO by vendor
  getAllPurchageOrder(vendor: Vendor) {
    this.submitted = true;
    this.payServices.getPurchageOrderById(vendor).then((res: any) => {
      console.log(res);
      this.allPurchaseOrders = res;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }
  temp: any[] = [];
  getAllPurchaseInvoice(vendor: Vendor) {
    this.submitted = true;
    this.payServices.getPurchaseInvoiceById(vendor).then((res: any) => {
      console.log(res);
      this.temp = res;
      this.allPurchaseInvoices = this.temp.sort((a, b) => a.createdAt - b.createdAt);
      //this.allPurchaseInvoices = res;

      this.totalGrossAmount = 0;
      this.totalRemainingAmount = 0;
      this.totalGrossAmount = this.allPurchaseInvoices
        .reduce((total, PI) =>
          total + PI.grossTotal, 0
        )
      this.totalRemainingAmount = this.allPurchaseInvoices
        .reduce((total, PI) =>
          total + PI.remainingAmount, 0
        )
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  createVendor() {
    this.router.navigate(['/pay/vendor/create']);
  }

  myFunction(item: any): string {
    return parseFloat(item).toFixed(2);
  }

  searchVendor: any;
  searchVendors(value: any) {
    if (value === null) {
      //alert(value);
      this.getAllVendors();
    }
    else {
      // this.submitted = true;
      this.payServices.searchVendor(value).then((res: any) => {
        console.log(res);
        this.allVendors = res;

        if (this.allVendors.length > 0) {
          this.changeVender(this.allVendors[0]);
        }
        else {
          this.activeVendor = {};
        }
        this.totalRecord = res.totalElements;
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
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
      this.getAllVendors();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

  onEditVendor(id: string) {
    this.router.navigate(['/pay/vendor/edit/' + id])
  }

}

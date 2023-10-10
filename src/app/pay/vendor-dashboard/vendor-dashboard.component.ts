import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayPageService } from '../pay-page.service';
import { Vendor } from 'src/app/settings/customers/customer';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {

  submitted: boolean = false;

  activeVendor: Vendor = {};
  totalRecord: number = 0;
  currentDue: number = 0;

  allVendorList: any = [];

  allVendorPO: any = [];
  allVendorSO: any = [];

  allVendorPI: any = [];
  allVendorSI: any = [];

  showOrders: boolean = true;
  showInvoices: boolean = true;

  showVendorPI: boolean = true;
  showVendorSI: boolean = true;
  currentSelectedOrder: number = 1;
  selectOrders: any = [
    {
      "id": "1",
      "name": "Purchase Order"
    },
    {
      "id": "2",
      "name": "Sale Order"
    }
  ]

  showInvoicePI: boolean = true;
  showInvoiceSI: boolean = true;
  currentSelectedInvoice: number = 1;
  selectInvoice: any = [
    {
      "id": "1",
      "name": "Purchase Invoice"
    },
    {
      "id": "2",
      "name": "Sale Invoice"
    }
  ]

  allPOByVendor: any = [];
  allSOByVendor: any = []

  constructor(private router: Router, private route: ActivatedRoute, private payServices: PayPageService) { }

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors() {
    this.payServices.allVendor().then((res: any) => {
      console.log(res);
      this.allVendorList = res.content;
      this.totalRecord = res.totalElements;
    })
  }

  // Change the Active Vendor
  changeVender(vl: Vendor) {
    this.currentDue = 0;
    this.activeVendor = vl;
    this.showAllVendorPO(vl);
    this.showAllVendorPI(vl);
    this.showAllVendorSI(vl);
  }

  // Create Vendor Function Navigation
  createVendor() {
    this.router.navigate(['/pay/vendor/create']);
  }

  changeOrder(Id: any) {

  }

  showOrdersPage() {
    this.showOrders = true;
    this.showInvoices = false;
  }

  // Getting all PO by vendor
  // showAllVendorPO(vendor: Vendor) {
  //   this.showOrdersPage();
  //   if (this.currentSelectedOrder == 1) {
  //     this.submitted = true;
  //     this.payServices.getPOByVendor(vendor)
  //       .then((res: any) => {
  //         console.log(res);
  //         this.allVendorPO = res;
  //         this.submitted = false;
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         this.submitted = false;
  //       })
  //   }
  // }

  showAllVendorPO(vendor: Vendor){
    this.submitted = true;
      this.payServices.getPOByVendor(vendor)
        .then((res: any) => {
          console.log(res);
          this.allVendorPO = res;
          this.submitted = false;
        })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
  }

  showAllVendorSO(vendor: Vendor) {
    this.showOrdersPage();
    if (this.currentSelectedOrder == 2) {
      this.submitted = true;
      this.payServices.getSOByVendor(vendor).then((res: any) => {
        this.allVendorPI = res;
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  showInvoicesPage() {
    this.showInvoices = true;
    this.showOrders = false;
  }

  // showAllVendorPI(vendor: Vendor) {
  //   this.showInvoicesPage();
  //   if (this.currentSelectedInvoice == 1) {
  //     this.showVendorPI = true;
  //     this.showVendorSI = false;

  //     this.submitted = true;
  //     this.payServices.getPIByVendor(vendor).then(
  //       (res: any) => {
  //         console.log(res);
  //         this.allVendorPI = res;
  //         this.submitted = false;
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         this.submitted = false;
  //       })
  //   }
  // }

  showAllVendorPI(vendor: Vendor) {
    this.submitted = true;
    this.payServices.getPIByVendor(vendor).then(
      (res: any) => {
        console.log(res);
        this.allVendorPI = res;
        this.submitted = false;
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })

  }

  showAllVendorSI(vendor: Vendor) {
    this.showInvoicesPage();
    if (this.currentSelectedInvoice == 2) {
      this.showVendorPI = false;
      this.showVendorSI = true;

      this.submitted = true;
      this.payServices.getSIByVendor(vendor).then(
        (res: any) => {
          this.allVendorSI = res;
          this.submitted = false;
        })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

}

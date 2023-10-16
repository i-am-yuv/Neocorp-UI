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
  totalRecord : number = 0;

  allVendors: any = [];
  allPurchaseOrders : any[] = [] ; // Vendor only have Purchase Orders
  allPurchaseInvoices : any[] = []; // Vendor only have Purchase Invoice

  activeVendor: Vendor = {};

  showOrders : boolean = true ;
  showInvoices : boolean  = false;

  totalRemainingAmount : number = 0;
  totalGrossAmount : number = 0.00;

  constructor(private router: Router, private route: ActivatedRoute, private payServices: PayPageService) { }

  ngOnInit(): void {
    this.getAllVendors();
    
  }

  getAllVendors() {
    this.submitted = true;
    this.payServices.allVendor().then((res: any) => {
      console.log(res);
      this.allVendors = res.content;
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

  refreshAll(){
    this.allPurchaseOrders  = [] ; // customer only have Purchase Orders
    this.allPurchaseInvoices = [];
    this.showOrders = true ;
    this.showInvoices  = false;
  }

  showOrdersPage() {
    this.showOrders = true;
    this.showInvoices = false;
  }

  showInvoicesPage(vendor: Vendor) {
    this.showInvoices = true;
    this.showOrders = false;

    this.submitted = true;
    this.payServices.getPurchaseInvoiceById(vendor)
    .then((res: any) => {
      this.allPurchaseInvoices = res;
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
    this.payServices.getPurchageOrderById(vendor)
    .then((res: any) => {
      console.log(res);
      this.allPurchaseOrders = res;
      this.submitted = false;
    })
    .catch((err) => {
      console.log(err);
      this.submitted = false;
    })
  }

  getAllPurchaseInvoice(vendor: Vendor){
    this.submitted = true;
    this.payServices.getPurchaseInvoiceById(vendor)
    .then((res: any) => {
      console.log(res);
      this.allPurchaseInvoices = res;
      // this.totalRemainingAmount = this.allPurchaseInvoices
      // .reduce((total, PI) => 
      //   total + PI.remainingAmount, 0
      // );

      this.totalRemainingAmount = 0 ;
      for (const purchaseInvoice of this.allPurchaseInvoices) 
        {
          // this.collectS.getRemainingAmountBySalesInvoice(salesInvoice).subscribe((amount: number) => {
          //   person.amount = amount; // Update the person's amount
          //   this.calculateTotalAmount();
          // });

          this.payServices.getRemainingAmountByPurchaseInvoice(purchaseInvoice).then(
            (res) => {
              this.totalRemainingAmount += res;
              console.log(res);
            }
          ).catch(
            (err) => {
              console.log(err);
            }
          )
        }

      this.totalGrossAmount = this.allPurchaseInvoices
      .reduce((total, PI) => 
        total + PI.grossTotal, 0
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

}

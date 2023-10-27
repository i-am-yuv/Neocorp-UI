import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, MenuItem, LazyLoadEvent } from 'primeng/api';
import { BankingService } from '../banking.service';
import { PurchaseInvoice } from 'src/app/collect/collect-models';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  stateOptions: any[] = [{ label: 'Pending', value: 'pending' }, { label: 'Completed', value: 'completed' }];
  value: string = 'pending';

  submitted: boolean = false;
  allCompletedPI: any[] = [];
  allNonCompletedPI: any[] = [];
  totalRecordsC: number = 0;
  totalRecordsNC: number = 0;
  activePI: PurchaseInvoice = {};

  items!: MenuItem[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private bankingS: BankingService,
    private payServices: PayPageService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Banking' }, { label: 'Payment' }];
    this.getAllPI();
  }

  createNewPI() {
    this.router.navigate(['/collect/purchaseInvoice/create']);
  }

  getAllPI() {
    
    // this.bankingS.getAllPI().then(
    //   (res) => {
    //     console.log(res);
    //     // this.allPI = res.content;
    //     this.allCompletedPI = res.content.filter((pi: PurchaseInvoice) => pi.status == 'COMPLETED');
    //     this.allNonCompletedPI = res.content.filter((pi: PurchaseInvoice) => pi.status != 'COMPLETED');

    //     // this.totalRemainingAmount = 0;
    //     for (const purchaseInvoice of this.allNonCompletedPI) {

    //       this.payServices.getRemainingAmountByPurchaseInvoice(purchaseInvoice).then(
    //         (res) => {

    //           this.allNonCompletedPI.find((invoice) => invoice.id === purchaseInvoice.id).remainingAmount = amount;
    //           console.log(res);
    //           // this.totalRemainingAmount += res ;
    //         }
    //       ).catch(
    //         (err) => {
    //           console.log(err);
    //         }
    //       )
    //     }

    //     this.totalRecordsC = this.allCompletedPI.length;
    //     this.totalRecordsNC = this.allNonCompletedPI.length;
    //     this.submitted = false;
    //   }
    // ).catch(
    //   (err) => {
    //     console.log(err);
    //     this.submitted = false;
    //   }
    // )
    var filter = '';
    if (this.search !== '') {
      var filtercols = [
        'vendor.firstName',
        'vendor.lastName',
        'vendor.mobileNumber',
        'requestStatus',
        'invoiceNo',
        'remainingAmount'
      ];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.submitted = true;
    this.bankingS.getAllPIs(this.pageNo, this.pageSize, this.sortField, this.sortDir, filter)
      .then(
        (res) => {
          console.log(res);
          // this.allPI = res.content;
          this.allCompletedPI = res.content.filter((pi: PurchaseInvoice) => pi.status == 'COMPLETED');
          this.allNonCompletedPI = res.content.filter((pi: PurchaseInvoice) => pi.status != 'COMPLETED');

          // this.totalRemainingAmount = 0;
          // for (const purchaseInvoice of this.allNonCompletedPI) {
          //   this.payServices.getRemainingAmountByPurchaseInvoice(purchaseInvoice).then(
          //     (res) => {
          //       var amount = res;
          //       if (amount == null) {
          //         amount = 0;
          //       }
          //       this.allNonCompletedPI.find((invoice) => invoice.id === purchaseInvoice.id).remainingAmount = res;
          //       console.log(res);
          //       // this.totalRemainingAmount += res ;
          //     }
          //   ).catch(
          //     (err) => {
          //       console.log(err);
          //     }
          //   )
          // }
          this.totalRecordsC = this.allCompletedPI.length;
          this.totalRecordsNC = this.allNonCompletedPI.length;
          this.submitted = false;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
  }

  // changeActivePI(pi: PurchaseInvoice) {
  //   this.activePI = pi;
  // }

  goToVendorPaymentPage(pi: PurchaseInvoice) {
    this.router.navigate(['banking/payToVendor/pi/' + pi.id]);
  }

  // myFunction(item: any): string {
  //   return parseFloat(item.remainingAmount).toFixed(2);
  // }

  // myFunction1(item: any): string {
  //   return parseFloat(item.grossTotal).toFixed(2);
  // }

  // p-table code from here 

  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  totalRecords: number = 0;
  selectedInventories!: any;

  loadPage(event: LazyLoadEvent) {
    if (event.globalFilter) {
      this.search = event.globalFilter.target.value;
    }
    this.pageNo = event.first! / 10;
    this.pageSize = event.rows!;
    if (event.sortField) {
      this.sortField = event.sortField;
    }
    this.sortDir = event.sortOrder! > 0 ? 'DESC' : 'ASC';
    // this.getInventoryFilter(this.search);
    this.getPaymentFilter(this.search);
  }


  getPaymentFilter(searchString: string) {
    this.search = searchString;
    // var userId = this.authService.getUserId();
    // this.storeUserService.getStore(userId).then((data) => {
    //   this.store = data;
    //   var filter = '';
    //   if (this.search !== '') {
    //     var filtercols = [
    //       'storeCatalog.product.name',
    //       'storage.name',
    //       'quantity',
    //       'storage.qtyOnHand',
    //     ];
    //     filter = FilterBuilder.build(filtercols, this.search);
    //   }
    var filter = '';
    if (this.search !== '') {
      var filtercols = [
        'vendor.firstName',
        'vendor.lastName',
        'vendor.mobileNumber',
        'requestStatus',
        'invoiceNo',
        'remainingAmount',
        'purchaseOrder.orderNumber'
      ];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.bankingS.getAllPIs(this.pageNo, this.pageSize, this.sortField, this.sortDir, filter)
      .then(
        (res) => {
          console.log(res);
          // this.allPI = res.content;
          this.allCompletedPI = res.content.filter((pi: PurchaseInvoice) => pi.status == 'COMPLETED');
          this.allNonCompletedPI = res.content.filter((pi: PurchaseInvoice) => pi.status != 'COMPLETED');

          // this.totalRemainingAmount = 0;
          // for (const purchaseInvoice of this.allNonCompletedPI) {

          //   this.payServices.getRemainingAmountByPurchaseInvoice(purchaseInvoice).then(
          //     (res) => {
          //       this.allNonCompletedPI.find((invoice) => invoice.id === purchaseInvoice.id).remainingAmount = res;
          //       console.log(res);
          //       // this.totalRemainingAmount += res ;
          //     }
          //   ).catch(
          //     (err) => {
          //       console.log(err);
          //     }
          //   )
          // }
          this.totalRecordsC = this.allCompletedPI.length;
          this.totalRecordsNC = this.allNonCompletedPI.length;
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

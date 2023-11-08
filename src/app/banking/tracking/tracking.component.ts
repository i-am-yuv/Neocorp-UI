import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankingService } from '../banking.service';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { Payment } from '../banking-model';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  stateOptions: any[] = [{ label: 'Disburse', value: 'disburse' }, { label: 'Collection', value: 'collection' }];
  value: string = 'disburse';

  submitted: boolean = false;

  totalDebitedAmount: number = 0;

  activePayment: Payment = {};

  allDebitPayments: any[] = [];
  totalRecords: number = 0;

  displayBeneDialog: boolean = false;

  items1!: MenuItem[];
  items2!: MenuItem[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private bankingS: BankingService,
    private authS: AuthService,
    private payServices: PayPageService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Tracking' }]);

    this.loadUser();

  }

  getAllPayments() {

    // var filter = '';
    // if (this.search !== '') {
    //   var filtercols = [
    //     'vendor.firstName',
    //     'vendor.lastName',
    //     'vendor.mobileNumber',
    //     'invoice.invoiceNo',
    //     'amount',
    //     'paymentRequest.debitAccountDetails.bankname',
    //     'paymentRequest.debitAccountDetails.AccountNumber',
    //     'paymentRequest.paymentMethod',
    //     'paymentRequest.upiId'
    //   ];
    //   filter = FilterBuilder.build(filtercols, this.search);
    // }

    // this.submitted = true;
    // this.bankingS.getAllDebitPayment(this.pageNo, this.pageSize, this.sortField, this.sortDir, filter).then(
    //   (res) => {
    //     console.log(res);
    //     this.allDebitPayments = res.content;
    //     this.totalRecords = res.totalElements;
    //     this.totalDebitedAmount = this.allDebitPayments
    //       .reduce((total, PI) =>
    //         total + PI.amount, 0
    //       )
    //     this.submitted = false;
    //   }
    // ).catch(
    //   (err) => {
    //     console.log(err);
    //     this.submitted = false;
    //   }
    // )

    this.submitted = true;
    this.bankingS.getAllDebitedPayments(this.currentUser).then(
      (res) => {
        console.log(res);
            this.allDebitPayments = res;
            this.totalDebitedAmount = this.allDebitPayments
              .reduce((total, PI) =>
                total + PI.amount, 0
              )
            this.submitted = false;
      }
    ).catch(
      (err) => {
         this.submitted = false;
         this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching all the Debited Transactions',
          life: 3000,
        });
      }
    )


  }

  addAccount() {

  }

  myFunction(item: any): string {
    return parseFloat(item).toFixed(2);
  }

  openBeneInfo(item: any) {
    this.displayBeneDialog = true;
    this.activePayment = item;
  }

  // p-table code from here 

  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
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

    var filter = '';
    if (this.search !== '') {
      var filtercols = [
        'vendor.firstName',
        'vendor.lastName',
        'vendor.mobileNumber',
        'invoice.invoiceNo',
        'amount',
        'paymentRequest.debitAccountDetails.bankname',
        'paymentRequest.debitAccountDetails.AccountNumber',
        'paymentRequest.paymentMethod',
        'paymentRequest.upiId'
      ];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    //  this.bankingS.getAllPIs(this.pageNo, this.pageSize, this.sortField, this.sortDir, filter)
    //    .then(
    //      (res) => {
    //        console.log(res);
    //        // this.allPI = res.content;
    //        this.allCompletedPI = res.content.filter((pi: PurchaseInvoice) => pi.status == 'COMPLETED');
    //        this.allNonCompletedPI = res.content.filter((pi: PurchaseInvoice) => pi.status != 'COMPLETED');

    //        this.totalRecordsC = this.allCompletedPI.length;
    //        this.totalRecordsNC = this.allNonCompletedPI.length;
    //        this.submitted = false;
    //      }
    //    ).catch(
    //      (err) => {
    //        console.log(err);
    //        this.submitted = false;
    //      }
    //    )

    this.submitted = true;
    this.bankingS.getAllDebitPayment(this.pageNo, this.pageSize, this.sortField, this.sortDir, filter).then(
      (res) => {
        console.log(res);
        this.allDebitPayments = res.content;
        this.totalRecords = res.totalElements;
        this.totalDebitedAmount = this.allDebitPayments
          .reduce((total, PI) =>
            total + PI.amount, 0
          )
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  searchPayments: any;
  searchPaymentsNow(a: any) {

  }

  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;

      // for disburse  
      this.getAllPayments();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

}

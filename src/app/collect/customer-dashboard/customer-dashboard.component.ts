import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CollectService } from '../collect.service';
import { CustomeR } from 'src/app/settings/customers/customer';
import { PayPageService } from 'src/app/pay/pay-page.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {

  submitted : boolean =  false;
  totalRecords: number = 0 ;

  allCustomers : any[] = [] ;
  allCustomerOrders : any[] = [] ; // customer only have Purchase Orders

  allCustomerSI : any[] = [];

  activeCustomer : CustomeR = {};

  showOrders : boolean = true ;
  showInvoices : boolean  = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private collectS: CollectService,
    private otherS : PayPageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  showOrdersPage()
  {
    this.showInvoices = false;
    this.showOrders = true;
  }

  showInvoicesPage(customer : CustomeR)
  {
    this.showInvoices = true;
    this.showOrders = false;
    this.submitted = true;
      
      this.collectS.allSalesInvoicesById(customer).then(
       (res:any) => {
          console.log(res) ;
          this.allCustomerSI = res ;
          this.submitted = false;
       }
     ).catch(
       (err) => {
         console.log(err);
         this.submitted = false;
       }
     )
  }

  getAllCustomers()
  {
    this.otherS.allCustomer().then(
      (res:any) => {
         console.log(res) ;
         this.allCustomers = res.content ;
         this.totalRecords = res.totalElements;
         this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  changeCustomer( customer : CustomeR)
  {
    //this.currentDue = 0;
    this.refeshAll();
    this.activeCustomer = customer;
    this.getCustomerData(customer);
    this.getAllSalesOrders(customer);
  }

  refeshAll()
  {
  //this.allCustomers = [] ;
  this.allCustomerOrders  = [] ; // customer only have Purchase Orders
  this.allCustomerSI = [];

  this.showOrders = true ;
  this.showInvoices  = false;
  }

  getAllSalesOrders(customer : CustomeR)
  {
    this.submitted = true;
    this.collectS.allSalesOrdersById(customer).then(
      (res:any) => {
         console.log(res) ;
         this.allCustomerOrders = res ;
         //this.totalRecords = res.totalElements;
         this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  getCustomerData(customer : CustomeR)
  {

  }

  CreateNewCustomer()
  {
    this.router.navigate(['/collect/createCustomer']); 
  }

  // changeInvoice(customer : CustomeR)
  // {
  //    if( this.currentSelectedInvoice == 1 )
  //    {
  //     // Here is Customer Purchase Invoices
  //     this.showCustomerPI = true;
  //     this.showCustomerSI = false;

  //     this.submitted = true;
  //      this.collectS.allPurchaseInvoicesById(customer).then(
  //       (res:any) => {
  //          console.log(res) ;
  //          this.allCustomerPI = res ;
  //          this.submitted = false;
  //       }
  //     ).catch(
  //       (err) => {
  //         console.log(err);
  //         this.submitted = false;
  //       }
  //     )

  //    }
  //    else if( this.currentSelectedInvoice == 2 )
  //    {
  //     // Here is Customer Sales Invoices
  //     this.showCustomerPI = false;
  //     this.showCustomerSI = true;

  //     this.submitted = true;
      
  //     this.collectS.allSalesInvoicesById(customer).then(
  //      (res:any) => {
  //         console.log(res) ;
  //         this.allCustomerSI = res ;
  //         this.submitted = false;
  //      }
  //    ).catch(
  //      (err) => {
  //        console.log(err);
  //        this.submitted = false;
  //      }
  //    )
  //    }
  // }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { CollectService } from '../collect.service';
import { CustomeR } from 'src/app/settings/customers/customer';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {

  submitted: boolean = false;
  totalRecords: number = 0;

  allCustomers: any[] = [];
  allCustomerOrders: any[] = []; // customer only have Purchase Orders

  allCustomerSI: any[] = [];

  activeCustomer: CustomeR = {};

  showOrders: boolean = true;
  showInvoices: boolean = false;

  totalRemainingAmount: number = 0;
  totalGrossAmount: number = 0.00;

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private collectS: CollectService,
    private otherS: PayPageService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {

    this.breadcrumbS.breadCrumb([{ label: 'Customers', routerLink: ['/collect/customers'] }, { label: 'Dashboard' }]);

    this.loadUser();
    // this.getAllCustomers();
  }

  showOrdersPage() {
    this.showInvoices = false;
    this.showOrders = true;
  }

  showInvoicesPage(customer: CustomeR) {
    this.showInvoices = true;
    this.showOrders = false;
    this.submitted = true;

    this.collectS.allSalesInvoicesById(customer).then(
      (res: any) => {
        console.log(res);
        this.allCustomerSI = res;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  getAllCustomers() {
    this.otherS.allCustomer(this.currentUser).then(
      (res: any) => {
        console.log(res);
        this.allCustomers = res;
        if (this.allCustomers.length > 0) {
          this.changeCustomer(this.allCustomers[0]);
        } else {
          this.activeCustomer = {};
        }
        this.totalRecords = res.totalElements;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  changeCustomer(customer: CustomeR) {
    //this.currentDue = 0;
    this.refeshAll();
    this.activeCustomer = customer;
    // this.getCustomerData(customer);
    this.getAllSalesOrders(customer);
    this.getAllSalesInvoices(customer);
  }

  getAllSalesInvoices(customer: CustomeR) {
    this.submitted = true;
    this.collectS.allSalesInvoicesById(customer).then((res: any) => {
      console.log(res);
      this.allCustomerSI = res;

      this.totalRemainingAmount = this.allCustomerSI.reduce(
        (total, oneSI) => total + oneSI.remainingAmount, 0
      );
      this.totalGrossAmount = this.allCustomerSI.reduce(
        (total, oneSI) => total + oneSI.grossTotal, 0
      );
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  refeshAll() {
    //this.allCustomers = [] ;
    this.allCustomerOrders = []; // customer only have Purchase Orders
    this.allCustomerSI = [];

    this.showOrders = true;
    this.showInvoices = false;
  }

  getAllSalesOrders(customer: CustomeR) {
    this.submitted = true;
    this.collectS.allSalesOrdersById(customer).then((res: any) => {
      console.log(res);
      this.allCustomerOrders = res;
      //this.totalRecords = res.totalElements;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  // getCustomerData(customer: CustomeR) {
  // }

  CreateNewCustomer() {
    this.router.navigate(['/collect/customer/create']);
  }


  myFunction(item: any): string {
    return parseFloat(item).toFixed(2);
  }


  searchCustomer: any;
  searchCustomers(value: any) {
    if (value === null) {
      //alert(value);
      this.getAllCustomers();
    }
    else {
      // this.submitted = true;
      this.otherS.searchCustomer(value).then((res: any) => {
        console.log(res);
        this.allCustomers = res.content;

        if (this.allCustomers.length > 0) {
          this.changeCustomer(this.allCustomers[0]);
        } else {
          this.activeCustomer = {};
        }
        this.totalRecords = res.totalElements;
        this.submitted = false;
      })
        .catch(
          (err) => {
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

      this.getAllCustomers();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  onEditCustomer(id: string) {
    this.router.navigate(['/collect/customer/edit/' + id]);
  }
}

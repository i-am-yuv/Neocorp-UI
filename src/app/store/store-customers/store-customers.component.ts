import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from 'src/app/masters/companies/company';
import { Store } from 'src/app/masters/stores/store';
import { StoreCustomer } from './store-customers';
import { StoreCustomersService } from './store-customers.service';
import { whitespacealpha } from 'src/app/dutch/custom.validators';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
@Component({
  selector: 'app-store-customers',
  templateUrl: './store-customers.component.html',
  styleUrls: ['./store-customers.component.scss'],
})
export class StoreCustomersComponent implements OnInit {
  storeCustomerDialog!: boolean;
  storeCustomerID: String = "";

  storeCustomers: StoreCustomer[] = [];
  storeData: StoreCustomer[] = [];

  storeCustomer: StoreCustomer = {};
  custCompany!: Company;
  companies: Company[] = [];

  selectedStoreCustomers!: any;

  submitted!: boolean;
  storeCustomerForm!: FormGroup;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  @ViewChild('dt') dt: Table | undefined;

  //currentstoreCustomer: StoreCustomer = {};

  roles: any;
  companyId: any;
  totalRecords: any;
  storeDt: any;
  constructor(
    private authService: AuthService,
    private storeCustomersService: StoreCustomersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.storeCustomerForm = this.fb.group({
      id: [''],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
          Validators.email,
        ],
      ],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
          // whitespacealpha,
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          // whitespacealpha,
        ],
      ],
      gst: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15)
        ],
      ]
    });
    this.items = [
      { label: 'Store Customers' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }


  openNew() {
    this.storeCustomer = {};
    //this.storeCustomer.company = this.currentstoreCustomer.company;
    //this.storeCustomer.store = this.currentstoreCustomer;
    this.submitted = false;
    this.storeCustomerDialog = true;
  }

  deleteSelectedStoreCustomers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected storeCustomers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storeCustomers = this.storeCustomers.filter(
          (val) => !this.selectedStoreCustomers.includes(val)
        );
        this.selectedStoreCustomers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'store Customers Deleted',
          life: 3000,
        });
      },
    });
  }

  editStoreCustomer(StoreCustomer: StoreCustomer) {
    this.storeCustomerID = StoreCustomer.id!;
    this.storeCustomer = { ...StoreCustomer };
    this.storeCustomerForm.patchValue({ ...StoreCustomer });
    this.storeCustomerDialog = true;
    //this.storeUserService.getStoresByCompany(StoreCustomer.company!.id).then(data => this.stores = data);
  }

  hideDialog() {
    this.storeCustomerDialog = false;
    this.submitted = false;
  }

  deleteStoreCustomer(storeCustomer: StoreCustomer) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + storeCustomer.firstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storeCustomersService
          .deleteCustomer(storeCustomer)
          .then((data) => {
            this.storeCustomers = this.storeCustomers.filter(
              (val) => val.id !== storeCustomer.id
            );
            this.storeCustomer = { user: {} };
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Store User Deleted',
              life: 3000,
            });
          });
      },
    });
  }
  saveStoreCustomer() {
    this.submitted = true;
    var storeCustomer = this.storeCustomerForm.value;
    this.storeCustomersService
      .getCompanyById(this.companyId)
      .then((data: any) => {
        this.custCompany = data;
        storeCustomer.company = data;
        if (this.storeCustomerID != "") {
          storeCustomer.id = this.storeCustomerID;
          this.storeCustomersService
            .updateCustomer(storeCustomer)
            .then((res: any) => {
              this.storeCustomerID = ""
              this.storeCustomers[this.findIndexById(res.id)] = res;
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Store Customer Updated',
                life: 3000,
              });
            });
        } else {
          this.storeCustomersService
            .createCustomer(storeCustomer)
            .then((res: any) => {
              this.storeCustomers.unshift(res);
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Store Customer Created',
                life: 3000,
              });
            });
        }
        // else if (storeCustomer) {
        //   this.storeCustomersService
        //   .createCustomer(storeCustomer)
        //   .then((res: any) => {
        //     this.storeCustomers.unshift(res);
        //     this.messageService.add({
        //       severity: 'success',
        //       summary: 'Successful',
        //       detail: 'StoreCustomer Created',
        //       life: 3000,
        //     });
        //   });
        // }
        // else {
        //   this.hideDialog();
        // }

        this.storeCustomers = [...this.storeCustomers];
        this.storeCustomerDialog = false;
        //this.StoreCustomer = {};
      });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.storeCustomers.length; i++) {
      if (this.storeCustomers[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  getRoles(roles: any) {
    var displayRoles: any[] = [];

    roles.forEach((role: any) => {
      displayRoles.push(role.name);
    });
    return displayRoles.join(',');
  }


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
    this.getStoreCustomerFilter(this.search);
  }

  getStoreCustomerFilter(searchString: string) {
    this.search = searchString;
    var userId = this.authService.getUserId();
    this.storeCustomersService.getStoreUserByUser(userId).then((data: any) => {
      // this.currentstoreCustomer = data;
      this.companyId = data.company.id;
      var filter = '';
      if (this.search !== '') {
        var filtercols = ['firstName', 'email', 'phone'];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.storeCustomersService
        .getCustomersByCompanyID(this.companyId, this.pageNo, this.pageSize, this.sortField, this.sortDir, filter)
        .then((data: any) => {
          this.storeCustomers = data;
          if (data) {
            this.storeCustomers = data.content;
            this.totalRecords = data.totalElements;
          }
        });
    });
  }
}

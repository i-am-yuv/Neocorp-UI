import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Company, CompanyForm } from 'src/app/masters/companies/company';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { User } from '../users/user';
import { Customer, CustomerForm } from './customer';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  customerForm!: FormGroup<CustomerForm>;

  customerDialog!: boolean;

  customers!: Customer[];

  // customer: Customer = {};

  users: User[] = [];

  companies: Company[] = [];

  selectedCustomers!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  totalRecords: any;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Customers' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    this.initForm();
    // this.customerService.getCustomers().then((data) => (this.customers = data));
    // this.customerService.getUsers().then((data) => (this.users = data));
    // this.customerService.getCompanies().then((data) => (this.companies = data));
  }
  applyFilterGlobal($event: any, stringVal: any) {
    // this.sortField = this.store.storeName;
    var searchString = ($event.target as HTMLInputElement).value;

    // this.dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
    if (searchString.length > 0) {
      this.search = searchString;
      this.getFilter(searchString);
    } else {
      this.getFilter(searchString);
    }
  }

  loadPage(event: LazyLoadEvent) {
    this.pageNo = event.first! / 10;
    this.pageSize = event.rows!;
    if (event.sortField) {
      this.sortField = event.sortField;
    }
    this.sortDir = event.sortOrder! > 0 ? 'DESC' : 'ASC';
    this.getFilter('');
  }

  getFilter(searchString: string) {
    this.search = searchString;
    var filter = '';
    if (this.search !== '') {
      var filtercols = ['customerName', 'phone'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.customerService
      .getCustomers(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.customers = data.content;

          this.totalRecords = data.totalElements;
        }
      });
    this.customerService.getUsers().then((data) => (this.users = data));
    this.customerService.getCompanies().then((data) => (this.companies = data));
  }
  private initForm() {
    this.customerForm = new FormGroup<CustomerForm>({
      id: new FormControl(''),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.email],
      }),
      firstName: new FormControl('', { nonNullable: true }),
      lastName: new FormControl(''),
      phone: new FormControl('', { nonNullable: true }),
      company: new FormGroup<CompanyForm>({ id: new FormControl('') }),
    });
  }

  openNew() {
    this.customerForm.reset();
    this.submitted = false;
    this.customerDialog = true;
  }

  deleteSelectedCustomers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Customers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedCustomers.length;
        this.selectedCustomers.forEach((customer: any) => {
          this.customerService.deleteCustomer(customer).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.customers = this.customers.filter(
                  (val) => !this.selectedCustomers.includes(val)
                );
                this.selectedCustomers = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Customers Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'Customers Deletion Error, Please refresh and try again',
                  life: 3000,
                });
              }
            }
          });
          counter++;
        });
      },
    });
  }

  editCustomer(customer: Customer) {
    this.customerForm.reset();
    this.customerDialog = true;
    this.customerForm.patchValue({ ...customer });
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + customer.firstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customerService
          .deleteCustomer(customer)
          .then((data) => {
            this.customers = this.customers.filter(
              (val) => val.id !== customer.id
            );
            // this.customer = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Customer Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Customer Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.customerDialog = false;
    this.submitted = false;
  }

  saveCustomer() {
    this.submitted = true;
    // this.customer = this.customerForm.value;
    var data = this.customerForm.value;
    if (data.firstName?.trim()) {
      if (data.id) {
        this.customerService.updateCustomer(data).then((res: any) => {
          // this.customers.push(res);
          this.customers[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Customer Updated',
            life: 3000,
          });
        });
      } else {
        this.customerService.createCustomer(data).then((res: any) => {
          this.customers.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Customer Created',
            life: 3000,
          });
        });
      }

      this.customers = [...this.customers];
      this.customerDialog = false;
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.customers.length; i++) {
      if (this.customers[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(
  //     ($event.target as HTMLInputElement).value,
  //     'contains'
  //   );
  // }
}

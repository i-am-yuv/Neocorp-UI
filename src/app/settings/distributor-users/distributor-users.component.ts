import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Company } from 'src/app/masters/companies/company';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { Warehouse } from 'src/app/masters/warehouses/warehouse';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { User } from '../users/user';
import { DistributorUser } from './distributor-user';
import { DistributorUserService } from './distributor-user.service';

@Component({
  selector: 'app-distributors',
  templateUrl: './distributor-users.component.html',
  styleUrls: ['./distributor-users.component.scss'],
})
export class DistributorUsersComponent implements OnInit {
  distributorDialog!: boolean;

  distributorUsers!: DistributorUser[];

  distributorUser: DistributorUser = {};

  users: User[] = [];

  companies: Company[] = [];

  distributors: Distributor[] = [];

  selectedDistributors!: any;

  memberOfs = [
    { value: 'TdsITAdmin', name: 'TdsITAdmin' },
    { value: 'TdsMaker', name: 'TdsMaker' },
    { value: 'TdsChecker', name: 'TdsChecker' },
  ];

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
    private distributorService: DistributorUserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Distributor Users' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.distributorService.getDistributorUsers().then(data => this.distributorUsers = data);
    // this.distributorService.getUsers().then(data => this.users = data);
    // this.distributorService.getCompanies().then(data => this.companies = data);
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
      var filtercols = [
        'distributor.distributorName',
        'phone',
        'user.userName',
      ];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.distributorService
      .getDistributorUsers(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.distributorUsers = data.content;

          this.totalRecords = data.totalElements;
        }
      });
    this.distributorService.getUsers().then((data) => (this.users = data));
    this.distributorService
      .getCompanies()
      .then((data) => (this.companies = data));
  }

  getDistributorsByCompany(e: any) {
    var company = e.value;

    this.distributorService
      .getDistributorsByCompany(company.id)
      .then((data) => (this.distributors = data));
  }
  openNew() {
    this.distributorUser = {};
    this.submitted = false;
    this.distributorDialog = true;
  }

  deleteSelectedDistributors() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Distributors?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.distributorUsers = this.distributorUsers.filter(
          (val) => !this.selectedDistributors.includes(val)
        );
        this.selectedDistributors = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Distributors Deleted',
          life: 3000,
        });
      },
    });
  }

  editDistributor(distributorUser: DistributorUser) {
    this.distributorUser = { ...distributorUser };
    this.distributorDialog = true;
    this.distributorService
      .getDistributorsByCompany(distributorUser.company!.id)
      .then((data) => (this.distributors = data));
  }

  deleteDistributor(distributorUser: DistributorUser) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + distributorUser.firstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.distributorService
          .deleteDistributorUser(distributorUser)
          .then((data) => {
            this.distributorUsers = this.distributorUsers.filter(
              (val) => val.id !== distributorUser.id
            );
            this.distributorUser = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Distributor Deleted',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.distributorDialog = false;
    this.submitted = false;
  }

  saveDistributor() {
    this.submitted = true;

    if (this.distributorUser.firstName?.trim()) {
      if (this.distributorUser.id) {
        this.distributorService
          .updateDistributorUser(this.distributorUser)
          .then((res: any) => {
            // this.distributors.push(res);
            this.distributorUsers[this.findIndexById(res.id)] = res;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Distributor Updated',
              life: 3000,
            });
          });
      } else {
        this.distributorService
          .createDistributorUser(this.distributorUser)
          .then((res: any) => {
            this.distributorUsers.push(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Distributor Created',
              life: 3000,
            });
          });
      }

      this.distributorUsers = [...this.distributorUsers];
      this.distributorDialog = false;
      this.distributorUser = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.distributorUsers.length; i++) {
      if (this.distributorUsers[i].id === id) {
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

  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }
}

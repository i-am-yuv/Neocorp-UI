import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Company } from 'src/app/masters/companies/company';
import { Store } from 'src/app/masters/stores/store';
import { StoreService } from 'src/app/masters/stores/store.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { User } from '../users/user';
import { StoreUser } from './store-user';
import { StoreUsersService } from './store-users.service';

@Component({
  selector: 'app-storeUsers',
  templateUrl: './store-users.component.html',
  styleUrls: ['./store-users.component.scss'],
})
export class StoreUsersComponent implements OnInit {
  storeUserDialog!: boolean;

  storeUsers!: StoreUser[];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  storeUser: StoreUser = {};

  users: User[] = [];

  companies: Company[] = [];

  stores: Store[] = [];

  selectedStoreUsers!: any;

  memberOfs = [
    { value: 'TdsITAdmin', name: 'TdsITAdmin' },
    { value: 'TdsMaker', name: 'TdsMaker' },
    { value: 'TdsChecker', name: 'TdsChecker' },
  ];

  submitted!: boolean;
  totalRecords: any;
  home!: MenuItem;
  items: MenuItem[] = [];

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private storeUserService: StoreUsersService,
    private storeService: StoreService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Store Users' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.storeUserService.getStoreUsers(0, 10).then(data => this.storeUsers = data);
    this.storeUserService.getUsers().then((data) => (this.users = data));
    this.storeUserService
      .getCompanies()
      .then((data) => (this.companies = data));
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
        'firstName',
        'store.storeName',
        'phone',
        'user.userName',
      ];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.storeUserService
      .getStoreUsers(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.storeUsers = data.content;

          this.totalRecords = data.totalElements;
        }
      });
    // this.storeUserService.getUsers().then(data => this.users = data);
    // this.storeUserService.getCompanies().then(data => this.companies = data);
  }
  getStoresByCompany(e: any) {
    var company = e.value;

    this.storeUserService
      .getStoresByCompany(company.id)
      .then((data) => (this.stores = data));
  }
  openNew() {
    this.storeUser = {};
    this.submitted = false;
    this.storeUserDialog = true;
  }

  deleteSelectedStoreUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected StoreUsers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storeUsers = this.storeUsers.filter(
          (val) => !this.selectedStoreUsers.includes(val)
        );
        this.selectedStoreUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'StoreUsers Deleted',
          life: 3000,
        });
      },
    });
  }

  editStoreUser(storeUser: StoreUser) {
    this.storeUser = { ...storeUser };
    this.storeUserDialog = true;
    this.storeUserService
      .getStoresByCompany(storeUser.company!.id)
      .then((data) => (this.stores = data));
  }

  deleteStoreUser(storeUser: StoreUser) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + storeUser.firstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storeUserService.deleteStoreUser(storeUser).then((data) => {
          this.storeUsers = this.storeUsers.filter(
            (val) => val.id !== storeUser.id
          );
          this.storeUser = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'StoreUser Deleted',
            life: 3000,
          });
        });
      },
    });
  }

  hideDialog() {
    this.storeUserDialog = false;
    this.submitted = false;
  }

  saveStoreUser() {
    this.submitted = true;

    if (this.storeUser.firstName?.trim()) {
      if (this.storeUser.id) {
        this.storeUserService
          .updateStoreUser(this.storeUser)
          .then((res: any) => {
            // this.storeUsers.push(res);
            this.storeUsers[this.findIndexById(res.id)] = res;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'StoreUser Updated',
              life: 3000,
            });
          });
      } else {
        this.storeUserService
          .createStoreUser(this.storeUser)
          .then((res: any) => {
            this.storeUsers.push(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'StoreUser Created',
              life: 3000,
            });
          });
      }

      this.storeUsers = [...this.storeUsers];
      this.storeUserDialog = false;
      this.storeUser = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.storeUsers.length; i++) {
      if (this.storeUsers[i].id === id) {
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
  // loadPage(params: any) {
  //   this.storeUserService.getStoreUsers(this.pageNo, this.pageSize).then((data) => {
  //     this.storeUsers = data.content;
  //     this.totalRecords = data.totalElements;
  //   });

  // }
}

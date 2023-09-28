import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from 'src/app/masters/companies/company';
import { Store } from 'src/app/masters/stores/store';
import { StoreService } from 'src/app/masters/stores/store.service';
import { StoreUsersService } from 'src/app/settings/store-users/store-users.service';
import { User } from 'src/app/settings/users/user';
import { StoreUser } from './store-user';
import { StoreUserService } from './store-user.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';

@Component({
  selector: 'app-store-user',
  templateUrl: './store-user.component.html',
  styleUrls: ['./store-user.component.scss'],
})
export class StoreUserComponent implements OnInit {
  storeUserDialog!: boolean;

  storeUsers: StoreUser[] = [];
  storeUsersData: StoreUser[] = [];

  storeUser: StoreUser = { user: {} };

  users: User[] = [];

  companies: Company[] = [];

  stores: Store[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  selectedStoreUsers!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;

  currentstoreUser: StoreUser = {};

  storeUseruser: any;
  roles: any;
  totalRecords: any;
  home!: MenuItem;
  items: MenuItem[] = [];
  storeId: any;
  storeDt: any;
  id: any;

  constructor(
    private authService: AuthService,
    private storeUserService: StoreUserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Store users' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };

    // var userId = this.authService.getUserId();
    // this.storeUserService.getStoreUserByUser(userId).then((data: any) => {
    //   this.currentstoreUser = data;
    //
    // });
    // this.storeUserService.getStore(userId).then((data: any) => {
    //   this.storeUserService.getStoreUsersByStore(data).then((data) => {
    //     this.storeUsers = data;
    //
    //   });
    // });
    this.storeUserService
      .getRolesByType('STORE')
      .then((data) => (this.roles = data));
    this.storeUserService
      .getCompanies()
      .then((data) => (this.companies = data));
  }

  openNew() {
    this.storeUser = {};
    this.storeUser.user = {};
    this.storeUser.company = this.currentstoreUser.company;
    this.storeUser.store = this.currentstoreUser.store;
    this.submitted = false;
    this.storeUserDialog = true;
  }

  deleteSelectedStoreUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Store Users?',
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
          detail: 'Store Users Deleted',
          life: 3000,
        });
      },
    });
  }

  editStoreUser(storeUser: StoreUser) {
    this.storeUser = { ...storeUser };
    this.storeUserDialog = true;
    //this.storeUserService.getStoresByCompany(storeUser.company!.id).then(data => this.stores = data);
  }

  deleteStoreUser(storeUser: StoreUser) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + storeUser.firstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storeUserService
          .deleteStoreUser(storeUser)
          .then((data) => {
            this.storeUsers = this.storeUsers.filter(
              (val) => val.id !== storeUser.id
            );
            // this.storeUser = { user: {} };
            this.storeUser = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Store User Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'User cannot delete his store ',
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
        var _storeUser = this.storeUser;
        this.storeUserService.updateStoreUser(_storeUser).then((res: any) => {
          this.storeUsers[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Store User Updated',
            life: 3000,
          });
        });
      } else {
        this.storeUserService
          .createStoreUser(this.storeUser)
          .then((res: any) => {
            this.storeUser.user = res;
            this.storeUsers.unshift(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Store User Created',
              life: 3000,
            });
          })
          .catch((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Please try again',
              detail:
                'Store user already exists in your store or in some other store',
              life: 10000,
            });
          });
      }

      this.storeUsers = [...this.storeUsers];
      this.storeUserDialog = false;
      //this.storeUser = {};
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
    this.getStoreUserFilter(this.search);
  }
  getStoreUserFilter(searchString: string) {
    this.search = searchString;

    var userId = this.authService.getUserId();
    this.storeUserService.getStoreUserByUser(userId).then((data: any) => {
      this.currentstoreUser = data;
    });
    var userId = this.authService.getUserId();
    this.storeUserService.getStore(userId).then((data: any) => {
      this.id = data.id;
      var filter = '';
      if (this.search !== '') {
        var filtercols = ['firstName', 'user.userName', 'phone'];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.storeUserService
        .getStoreUsersByStore(
          this.id,
          this.pageNo,
          this.pageSize,
          this.sortField,
          this.sortDir,
          filter
        )
        .then((data) => {
          this.storeUsers = data;
          if (data) {
            this.storeUsers = data.content;
            this.totalRecords = data.totalElements;
          }
        });
    });
    // this.storeUserService.getStoresPagination(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search)
    //   .then((data) => {
    //     this.storeDt = data;
    //
    //     if (data) {
    //       this.storeUsers = data.content;
    //       this.totalRecords = data.totalElements;
    //     }
    //   });
    // var userId = this.authService.getUserId();
    // this.storeUserService.getStore(userId).then((data: any) => {
    //   this.id = data.id;
    //   this.storeUserService.getStoreUsersByStore(this.id,this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search).then((data) => {
    //     this.storeUsers = data;
    //
    //     if (data) {
    //       this.storeUsers = data.content;
    //
    //       this.totalRecords = data.totalElements;
    //
    //     }
    //   });
    // });
    // this.storeUserService.getStoreUserByUser(userId, ).then((data: any) => {
    //
    //   this.currentstoreUser = data;
    //
    //
    //   if (data) {
    //     this.storeUsers = data.content;
    //     this.totalRecords = data.totalElements;
    //
    //   }
    // });
  }
}

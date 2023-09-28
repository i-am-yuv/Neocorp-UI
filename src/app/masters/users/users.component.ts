import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MenuItem,
  MessageService,
  ConfirmationService,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';

import { Users } from './users';
import { RoleService } from 'src/app/settings/roles/roleService';
import { Role } from 'src/app/settings/roles/role';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  user!: Users;
  userss!: Users[];

  roles: Role[] = [];
  usersDialog!: boolean;

  usersData!: Users[];

  selectedUsers!: any;

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  countries: any = [];

  @ViewChild('dt') dt: Table | undefined;
  totalRecords: any;

  constructor(
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'User' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.usersService.getStates().then(data => this.states = data);
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.usersDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersData = this.usersData.filter(
          (val) => !this.selectedUsers.includes(val)
        );
        this.selectedUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'States Deleted',
          life: 3000,
        });
      },
    });
  }

  editUser(user: Users) {
    this.user = { ...user };
    this.usersDialog = true;
  }

  deleteUsers(user: Users) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.accountNumber + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(user).then((data) => {
          this.usersData = this.usersData.filter((val) => val.id !== user.id);
          this.user = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Users Deleted',
            life: 3000,
          });
        });
      },
    });
  }

  hideDialog() {
    this.usersDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.accountNumber?.trim()) {
      if (this.user.id) {
        console.log('iside id' + this.user.id);
        this.usersService.updateUser(this.user).then((res: any) => {
          // this.states.push(res);
          this.usersData[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Users Updated',
            life: 3000,
          });
        });
      } else {
        console.log('iside id');
        this.usersService.createUser(this.user).then((res: any) => {
          this.usersData.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Users Created',
            life: 3000,
          });
        });
      }

      this.usersData = [...this.usersData];
      this.usersDialog = false;
      this.user = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.usersData.length; i++) {
      if (this.usersData[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
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
    this.sortDir = event.sortOrder! > 0 ? 'ASC' : 'DESC';
    this.getFilter('');
    this.roleService
      .getRoles(this.pageNo, this.pageSize, this.sortField, this.sortDir, '')
      .then((data) => (this.roles = data.content));
  }

  getFilter(searchString: string) {
    this.search = searchString;
    var filter = '';
    if (this.search !== '') {
      var filtercols = ['Userline1', 'Userline2', 'city', 'country'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.usersService
      .getUserData(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.usersData = data.content;
          this.totalRecords = data.totalElements;
        }
      });
  }
  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }
}

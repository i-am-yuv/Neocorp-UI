import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Company } from 'src/app/masters/companies/company';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { User } from './user';
import { UserService } from './userService';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  userDialog!: boolean;

  users!: User[];

  user!: User;

  roles: any[] = [];

  companies: Company[] = [];

  selectedUsers!: any;

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
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Users' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.userService.getUsers().then(data => this.users = data);
    // this.userService.getRoles().then(data => this.roles = data);
    // this.userService.getCompanies().then(data => this.companies = data);
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
      var filtercols = ['userName', 'email', 'getRoles(user.roles)'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.userService
      .getUsers(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.users = data.content;

          this.totalRecords = data.totalElements;
        }
      });
    this.userService.getRoles().then((data) => (this.roles = data));
    this.userService.getCompanies().then((data) => (this.companies = data));
  }
  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(
          (val) => !this.selectedUsers.includes(val)
        );
        this.selectedUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Users Deleted',
          life: 3000,
        });
      },
    });
  }

  editUser(user: User) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.userName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(user).then((data) => {
          this.users = this.users.filter((val) => val.id !== user.id);
          this.user = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Deleted',
            life: 3000,
          });
        });
      },
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;
    this.user.isActive = true;
    if (this.user.userName?.trim()) {
      if (this.user.id) {
        this.userService.updateUser(this.user).then((res: any) => {
          // this.users.push(res);
          this.users[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Updated',
            life: 3000,
          });
        });
      } else {
        this.userService.createUser(this.user).then((res: any) => {
          this.users.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Created',
            life: 3000,
          });
        });
      }

      this.users = [...this.users];
      this.userDialog = false;
      this.user = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
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

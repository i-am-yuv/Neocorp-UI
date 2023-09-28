import { Distributor } from './../../masters/distributors/distributor';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Warehouse } from 'src/app/masters/warehouses/warehouse';
import { User } from 'src/app/settings/users/user';
import { DistributorUser } from './distributor-user';
import { DistributorUserService } from './distributor-user.service';
import { Role } from 'src/app/settings/roles/role';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';

@Component({
  selector: 'app-distributor-user',
  templateUrl: './distributor-user.component.html',
  styleUrls: ['./distributor-user.component.scss'],
})
export class DistributorUserComponent implements OnInit {
  distributorUserDialog!: boolean;

  // users!: User[];

  distributorUsers: DistributorUser[] = [];
  totalRecords: any;

  distributorUser: DistributorUser = { user: {} };

  warehouse!: Warehouse;
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';
  roles: any;

  selectedUsers!: any;

  submitted!: boolean;

  currentuser: any;

  currentstore: any;

  @ViewChild('dt') dt: Table | undefined;
  distributor: any;

  home!: MenuItem;
  items: MenuItem[] = [];
  distData: any;
  fieldTextType!: boolean;

  constructor(
    private userService: DistributorUserService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Distributor Users' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.authService.getUser().then((data) => {
    //   if (data) {
    //
    //     this.userService.getDistributorUser(data.id).then((res: any) => {
    //       this.currentuser = res;
    //
    //       this.userService
    //         .getUsers(res.distributor)
    //         .then((data) => (this.distributorUsers = data));
    //     });
    //   }
    // });
    // this.userService
    //   .getRolesByType('DISTRIBUTOR')
    //   .then((data) => {
    //     this.roles = data;
    //   });
  }

  openNew() {
    this.distributorUser = { user: {} };
    this.distributorUser.company = this.currentuser.company;
    this.distributorUser.distributor = this.currentuser.distributor;
    this.submitted = false;
    this.distributorUserDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.distributorUsers = this.distributorUsers.filter(
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
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  editUser(user: DistributorUser) {
    this.distributorUser = { ...user };
    this.distributorUserDialog = true;
  }

  deleteUser(user: DistributorUser) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.firstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(user).then((data) => {
          this.distributorUsers = this.distributorUsers.filter(
            (val) => val.id !== user.id
          );
          this.distributorUser = {};
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
    this.distributorUserDialog = false;
    this.submitted = false;
  }

  saveDistributorUser() {
    this.submitted = true;
    if (this.distributorUser.firstName?.trim()) {
      if (this.distributorUser.id) {
        this.userService.updateUser(this.distributorUser).then((res: any) => {
          // this.users.push(res);
          this.distributorUsers[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Updated',
            life: 3000,
          });
        });
      } else {
        this.userService
          .createUser(this.distributorUser)
          .then((res: any) => {
            this.distributorUsers.unshift(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Created',
              life: 3000,
            });
          })
          .catch((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Please try again',
              detail:
                'Distributor user already exists in your company or in some other distributor',
              life: 10000,
            });
          });
      }

      this.distributorUsers = [...this.distributorUsers];
      this.distributorUserDialog = false;
      this.distributorUser = { user: {} };
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
    this.getUserFilter(this.search);
  }
  getUserFilter(searchString: string) {
    this.search = searchString;
    this.authService.getUser().then((data) => {
      if (data) {
        this.userService.getDistributorUser(data.id).then((res: any) => {
          this.currentuser = res;
          var filter = '';
          if (this.search !== '') {
            var filtercols = ['firstName', 'phone', 'user.userName'];
            filter = FilterBuilder.build(filtercols, this.search);
          }
          this.userService
            .getUsers(
              res.distributor,
              this.pageNo,
              this.pageSize,
              this.sortField,
              this.sortDir,
              filter
            )
            .then((data) => {
              this.distributorUsers = data;
              if (data) {
                this.distributorUsers = data.content;
                this.totalRecords = data.totalElements;
              }
            });
        });
      }
    });
    this.userService.getRolesByType('DISTRIBUTOR').then((data) => {
      this.roles = data;
    });
  }
}

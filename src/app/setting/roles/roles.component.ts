import { Component, OnInit, ViewChild } from '@angular/core';
import { Roles } from './roles';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesServiceService } from './roles-service.service';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Privilege } from '../privilege/privilege';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roleDialog!: boolean;

  roles!: Roles[];

  privilege!: Privilege[]

  role!: Roles;

  roleTypes: string[] = ['ACCOUNTANT', 'ADMIN'];
  roleForm!: FormGroup;
  selectedRoles!: any;

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  @ViewChild('dt') dt: Table | undefined;
  totalRecords: any;

  constructor(
    private router: Router,
    private rolesService: RolesServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Roles' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.roleService.getRoles().then((data) => (this.roles = data));

    this.roleForm = this.fb.group({
      id: [],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      roleId: [],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    });
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
      var filtercols = ['name', 'description'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.rolesService
      .getRoles(
        // this.pageNo,
        // this.pageSize,
        // this.sortField,
        // this.sortDir,
        // filter
      )
      .then((data) => {
        if (data) {
          this.roles = data.content;

          this.totalRecords = data.totalElements;
        }
      });
  }
  editPrivileges(role: any) {
    this.router.navigate(['/setting/roles-privilege/' + role.id]);
  }

  openNew() {
    this.role = {};
    this.submitted = false;
    this.roleDialog = true;
  }

  deleteSelectedRoles() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Roles?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roles = this.roles.filter(
          (val) => !this.selectedRoles.includes(val)
        );
        this.selectedRoles = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Roles Deleted',
          life: 3000,
        });
      },
    });
  }

  editRole(role: Roles) {
    this.role = { ...role };
    this.roleDialog = true;
  }

  deleteRole(role: Roles) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rolesService.deleteRole(role).then((data) => {
          this.roles = this.roles.filter((val) => val.id !== role.id);
          this.role = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Role Deleted',
            life: 3000,
          });
        });
      },
    });
  }




  hideDialog() {
    this.roleDialog = false;
    this.submitted = false;
  }

  saveRole() {
    this.submitted = true;

    if (this.role.name?.trim()) {
      if (this.role.id) {
        this.rolesService.updateRole(this.role).then((res: any) => {
          // this.roles.push(res);
          this.roles[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Role Updated',
            life: 3000,
          });
        });
      } else {
        this.rolesService.createRole(this.role).then((res: any) => {
          this.roles.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Role Created',
            life: 3000,
          });
        });
      }

      this.roles = [...this.roles];
      this.roleDialog = false;
      this.role = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].id === id) {
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


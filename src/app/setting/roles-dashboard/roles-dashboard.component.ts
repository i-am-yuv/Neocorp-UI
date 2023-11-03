import { Component, OnInit, ViewChild } from '@angular/core';
import { Roles } from '../roles/roles';
import { Privilege } from '../privilege/privilege';
import { RolesServiceService } from '../roles/roles-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';

@Component({
  selector: 'app-roles-dashboard',
  templateUrl: './roles-dashboard.component.html',
  styleUrls: ['./roles-dashboard.component.scss']
})
export class RolesDashboardComponent implements OnInit {

  allRoles: any[] = [];
  activeRole: Roles = {};
  totalRecords: number = 0;
  roleDialog!: boolean;

  roles!: Roles[];

  privilege!: Privilege[]

  role!: Roles;

  // roleTypes: string[] = ['ACCOUNTANT', 'ADMIN'];
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
  // totalRecords: any;

  constructor(
    private router: Router,
    private rolesService: RolesServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.items = [{ label: 'Settings' }, { label: 'Roles' }, { label: 'Dashboard' }];

    this.getAllRoles();
  }


  getAllRoles() {
    this.submitted = true;
    this.rolesService.getRoles()
      .then((res: any) => {
        this.allRoles = res.content;
        this.totalRecords = res.totalElements;
        this.submitted = false;
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }


  changeRole(role: Roles) {
    this.activeRole = role;
  }


  onEditRole(id: string) {
    this.router.navigate(['setting/role/edit/' + id]);
  }

  // editPrivileges(role: any) {
  //   this.router.navigate(['/setting/roles-privilege/' + role.id]);
  // }

  // editRole(role: Roles) {
  //   this.role = { ...role };
  //   this.roleDialog = true;
  // }

  // deleteRole(role: Roles) {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete ' + role.name + '?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.rolesService.deleteRole(role).then((data) => {
  //         this.roles = this.roles.filter((val) => val.id !== role.id);
  //         this.role = {};
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Successful',
  //           detail: 'Role Deleted',
  //           life: 3000,
  //         });
  //       });
  //     },
  //   });
  // }

  openNew() {
    this.router.navigate(['/setting/role/create']);
  }

}




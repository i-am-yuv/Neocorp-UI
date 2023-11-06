import { Component, OnInit, ViewChild } from '@angular/core';
import { Privilege } from '../privilege/privilege';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Roles } from '../setting-models';
import { SettingService } from '../setting.service';

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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private authS : AuthService,
    private SettingS : SettingService
  ) { }

  ngOnInit() {
    this.items = [{ label: 'Settings' }, { label: 'Roles' }, { label: 'Dashboard' }];

    this.loadUser();

  }


  getAllRoles() {
    this.submitted = true;
    this.SettingS.getAllRoles(this.currentUser)
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

  openNew() {
    this.router.navigate(['/setting/role/create']);
  }

  currentCompany : any = {} ;
  currentUser : any = {} ;
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser  = res ;
      this.submitted = false;
      this.getAllRoles();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

}




import { Component, OnInit, ViewChild } from '@angular/core';
import { Privilege } from './privilege';
import { PrivilegeService } from './privilege.service';
import { MenuItem, MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.scss']
})
export class PrivilegeComponent implements OnInit {

  privilegeDialog!: boolean;

  privileges!: Privilege[];

  privilege!: Privilege;

  selectedPrivileges!: any;

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
    private privilegeService: PrivilegeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authS : AuthService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Privileges' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.privilegeService.getPrivileges().then(data => this.privileges = data);
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
        'name',
        'controllerIdentifier',
        'methodIdentifier',
        'apiPath',
        'description',
      ];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.privilegeService
      .getPrivileges(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.privileges = data.content;

          this.totalRecords = data.totalElements;
        }
      });
  }
  openNew() {
    this.privilege = {};
    this.submitted = false;
    this.privilegeDialog = true;
  }

  deleteSelectedPrivileges() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Privileges?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedPrivileges.length;
        this.selectedPrivileges.forEach((privilege: any) => {
          this.privilegeService.deletePrivilege(privilege).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.privileges = this.privileges.filter(
                  (val) => !this.selectedPrivileges.includes(val)
                );
                this.selectedPrivileges = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Privileges Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'Privileges Deletion Error, Please refresh and try again',
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

  editPrivilege(privilege: Privilege) {
    this.privilege = { ...privilege };
    this.privilegeDialog = true;
  }

  deletePrivilege(privilege: Privilege) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + privilege.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.privilegeService
          .deletePrivilege(privilege)
          .then((data) => {
            this.privileges = this.privileges.filter(
              (val) => val.id !== privilege.id
            );
            this.privilege = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Privilege Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Privilege Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.privilegeDialog = false;
    this.submitted = false;
  }

  savePrivilege() {
    this.submitted = true;

    if (this.privilege.name?.trim()) {
      if (this.privilege.id) {
        this.privilegeService
          .updatePrivilege(this.privilege)
          .then((res: any) => {
            // this.privileges.push(res);
            this.privileges[this.findIndexById(res.id)] = res;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Privilege Updated',
              life: 3000,
            });
          });
      } else {
        this.privilege.user = this.currentUser ;
        this.privilegeService
          .createPrivilege(this.privilege)
          .then((res: any) => {
            this.privileges.unshift(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Privilege Created',
              life: 3000,
            });
          });
      }

      this.privileges = [...this.privileges];
      this.privilegeDialog = false;
      this.privilege = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.privileges.length; i++) {
      if (this.privileges[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }

    
  currentCompany : any = {} ;
  currentUser : any = {} ;
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser  = res ;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

}

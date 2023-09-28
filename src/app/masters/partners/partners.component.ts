import { PartnersService } from './partners.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';

import { Partner } from './partners';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent implements OnInit {
  partnerDialog!: boolean;

  partners: Partner[] = [];
  partnersData: Partner[] = [];

  partner: Partner = {};

  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  selectedPartners!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;

  currentPartner: Partner = {};

  // storeUseruser: any;
  roles: any;
  totalRecords: any;
  home!: MenuItem;
  items: MenuItem[] = [];
  // storeId: any;
  //storeDt: any;
  id: any;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private partnersService: PartnersService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Partners' }];
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
    // this.storeUserService
    //   .getRolesByType('STORE')
    //   .then((data) => (this.roles = data));
    // this.storeUserService
    //   .getCompanies()
    //   .then((data) => (this.companies = data));
  }

  openNew() {
    this.partner = {};
    //this.storeUser.user = {};
    //this.storeUser.company = this.currentstoreUser.company;
    //this.storeUser.store = this.currentstoreUser.store;
    this.submitted = false;
    this.partnerDialog = true;
  }

  deleteSelectedPartners() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Store Users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.partners = this.partners.filter(
          (val) => !this.selectedPartners.includes(val)
        );
        this.selectedPartners = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Store Users Deleted',
          life: 3000,
        });
      },
    });
  }

  editPartner(partner: Partner) {
    this.partner = { ...partner };
    this.partnerDialog = true;
    //this.storeUserService.getStoresByCompany(storeUser.company!.id).then(data => this.stores = data);
  }

  deletePartner(partner: Partner) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + partner.firstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.partnersService
          .deletePartner(partner)
          .then((data) => {
            this.partners = this.partners.filter(
              (val) => val.id !== partner.id
            );
            // this.storeUser = { user: {} };
            this.partner = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Partner  Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Partner cannot delete  ',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.partnerDialog = false;
    this.submitted = false;
  }

  savePartner() {
    this.submitted = true;

    if (this.partner.firstName?.trim()) {
      if (this.partner.id) {
        var _partner = this.partner;
        this.partnersService.updatePartner(_partner).then((res: any) => {
          this.partners[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Partner Details Updated',
            life: 3000,
          });
        });
      } else {
        this.partnersService
          .createPartner(this.partner)
          .then((res: any) => {
            //this.storeUser.user = res;
            this.partners.unshift(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Partner  Created',
              life: 3000,
            });
          })
          .catch((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Please try again',
              detail: 'Partnerr already exists',
              life: 10000,
            });
          });
      }

      this.partners = [...this.partners];
      this.partnerDialog = false;
      //this.storeUser = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.partners.length; i++) {
      if (this.partners[i].id === id) {
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
    this.getPartnerFilter(this.search);
  }

  getPartnerFilter(searchString: string) {
    this.search = searchString;
    var filter = '';
    if (this.search !== '') {
      var filtercols = [
        'partnerCode',
        'companyName',
        'mobileNumber',
        'firstName',
        'panNumber',
      ];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.partnersService
      .getAllPartner(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.partners = data.content;
          this.totalRecords = data.totalElements;
        }
      });

    // this.search = searchString;
    // var userId = this.authService.getUserId();
    // this.storeUserService.getStoreUserByUser(userId).then((data: any) => {
    //   this.currentstoreUser = data;
    // });
    // var userId = this.authService.getUserId();
    // this.storeUserService.getStore(userId).then((data: any) => {
    //   this.id = data.id;
    //   var filter = '';
    //   if (this.search !== '') {
    //     var filtercols = ['firstName', 'user.userName', 'phone'];
    //     filter = FilterBuilder.build(filtercols, this.search);
    //   }
    //   this.storeUserService
    //     .getStoreUsersByStore(
    //       this.id,
    //       this.pageNo,
    //       this.pageSize,
    //       this.sortField,
    //       this.sortDir,
    //       filter
    //     )
    //     .then((data) => {
    //       this.partners = data;
    //       if (data) {
    //         this.partners = data.content;
    //         this.totalRecords = data.totalElements;
    //       }
    //     });
    // });
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

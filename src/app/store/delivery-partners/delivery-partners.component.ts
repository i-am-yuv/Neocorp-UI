import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Company } from 'src/app/masters/companies/company';
import { State } from 'src/app/masters/states/state';
import { Store } from 'src/app/masters/stores/store';
import { StoreService } from 'src/app/masters/stores/store.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { StoreUserService } from '../store-user/store-user.service';
import { DeliveryPartnersService } from './delivery-partners.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-delivery-partners',
  templateUrl: './delivery-partners.component.html',
  styleUrls: ['./delivery-partners.component.scss'],
})
export class DeliveryPartnersComponent implements OnInit {
  deliveryPartnerDialog!: boolean;

  deliveryPartners!: Store[];
  //  storesData!: Store[];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  deliveryPartner: Store = {};
  selectedDeliveryPartner!: any;
  submitted!: boolean;
  @ViewChild('dt') dt: Table | undefined;
  companies: Company[] = [];
  agencies: State[] = [];
  global: boolean = true;
  company: any;
  totalRecords: number = 0;
  home!: MenuItem;
  items: MenuItem[] = [];
  //storeDt: any;
  //deliveryPartnerDetails!: FormGroup;
  store: any;
  constructor(
    private storeService: StoreService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storeUserService: StoreUserService,
    private router: Router,
    private fb: FormBuilder,
    private deliveryAgencyService: DeliveryPartnersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.getStoreDetails();
    // if (this.router.url.includes('my-stores')) {
    //   this.storeUserService.getCurrentStore().then((res: any) => {
    //     this.global = false;
    //     this.company = res.company;
    //     this.storeService
    //       .getStoresByCompany(res.company.id)
    //       .then((data) => {
    //         this.stores = data
    //       });
    //   });
    // } else {

    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store: any) => {
        this.store = store;
      });
    console.log('store id: ' + this.store.id);
    this.deliveryAgencyService
      .getDeliveryAgencies(this.store.id)
      .then((data) => (this.deliveryPartners = data));
    //this.storeService.getCompanies().then((data) => (this.companies = data));
    this.storeService.getStates().then((data) => (this.agencies = data));

    this.items = [{ label: 'DeliveryPartner' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  openNew() {
    this.deliveryPartner = {};
    this.submitted = false;
    this.deliveryPartnerDialog = true;
  }

  deleteSelectedStores() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Stores?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedDeliveryPartner.length;
        this.selectedDeliveryPartner.forEach((store: any) => {
          this.storeService.deleteStore(store).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.deliveryPartners = this.deliveryPartners.filter(
                  (val) => !this.selectedDeliveryPartner.includes(val)
                );
                this.selectedDeliveryPartner = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Stores Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Stores Deletion Error, Please refresh and try again',
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

  editStore(deliveryPartner: Store) {
    this.deliveryPartner = { ...deliveryPartner };
    this.deliveryPartnerDialog = true;
  }

  deleteStore(store: Store) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + store.storeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storeService
          .deleteStore(store)
          .then((data) => {
            this.deliveryPartners = this.deliveryPartners.filter(
              (val) => val.id !== store.id
            );
            this.deliveryPartner = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Store Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Store Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.deliveryPartnerDialog = false;
    this.submitted = false;
  }

  saveStore() {
    this.submitted = true;
    if (!this.global) {
      this.deliveryPartner.company = this.company;
    }
    if (this.deliveryPartner.storeName?.trim()) {
      if (this.deliveryPartner.id) {
        this.storeService.updateStore(this.deliveryPartner).then((res: any) => {
          // this.stores.push(res);
          this.deliveryPartners[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Store Updated',
            life: 3000,
          });
        });
      } else {
        this.storeService.createStore(this.deliveryPartner).then((res: any) => {
          this.deliveryPartners.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Store Created',
            life: 3000,
          });
        });
      }
      this.deliveryPartners = [...this.deliveryPartners];
      this.deliveryPartnerDialog = false;
      this.deliveryPartner = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.deliveryPartners.length; i++) {
      if (this.deliveryPartners[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
  loadStore(event: LazyLoadEvent) {
    if (event.globalFilter) {
      this.search = event.globalFilter.target.value;
    }
    this.pageNo = event.first! / 10;
    this.pageSize = event.rows!;
    if (event.sortField) {
      this.sortField = event.sortField;
    }
    this.sortDir = event.sortOrder! > 0 ? 'DESC' : 'ASC';
    this.getStoreFilter(this.search);
  }
  getStoreFilter(searchString: string) {
    this.search = searchString;
    if (this.router.url.includes('my-stores')) {
      this.storeUserService.getCurrentStore().then((res: any) => {
        this.global = false;
        this.company = res.company;
        var filter = '';
        if (this.search !== '') {
          var filtercols = [
            'storeName',
            'company.companyName',
            'storeLocation',
          ];
          filter = FilterBuilder.build(filtercols, this.search);
        }
        this.storeService
          .getStoresByCompany(
            res.company.id,
            this.pageNo,
            this.pageSize,
            this.sortField,
            this.sortDir,
            filter
          )
          .then((data) => {
            if (data) {
              this.deliveryPartners = data.content;
              this.totalRecords = data.totalElements;
            }
          });
      });
    }
    // else {
    // this.storeService.getStores(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search).then((data) => {
    //   // this.stores = data;
    //   if (data) {
    //     this.stores = data.content;
    //     console.log(this.stores);
    //     this.totalRecords = data.totalElements;
    //   }
    // });
    // }
    // this.storeService.getCompanies().then((data) => (this.companies = data));
    // this.storeService.getStates().then((data) => (this.states = data));
  }
}

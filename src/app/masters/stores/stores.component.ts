import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreUserService } from 'src/app/store/store-user/store-user.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Company } from '../companies/company';
import { State } from '../states/state';
import { Store } from './store';
import { StoreService } from './store.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
})
export class StoresComponent implements OnInit {
  storeDialog!: boolean;

  stores!: Store[];
  storesData!: Store[];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  store: Store = {};
  selectedStores!: any;
  submitted!: boolean;
  @ViewChild('dt') dt: Table | undefined;
  companies: Company[] = [];
  states: State[] = [];
  global: boolean = true;
  company: any;
  totalRecords: number = 0;
  home!: MenuItem;
  items: MenuItem[] = [];
  storeDt: any;
  storeDetails!: FormGroup;

  constructor(
    private storeService: StoreService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storeUserService: StoreUserService,
    private router: Router,
    private fb: FormBuilder
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
    this.storeService.getStores().then((data) => (this.stores = data));
    this.storeService.getCompanies().then((data) => (this.companies = data));
    this.storeService.getStates().then((data) => (this.states = data));

    this.items = [{ label: 'Store' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  openNew() {
    this.store = {};
    this.submitted = false;
    this.storeDialog = true;
  }

  deleteSelectedStores() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Stores?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedStores.length;
        this.selectedStores.forEach((store: any) => {
          this.storeService.deleteStore(store).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.stores = this.stores.filter(
                  (val) => !this.selectedStores.includes(val)
                );
                this.selectedStores = null;
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

  editStore(store: Store) {
    this.store = { ...store };
    this.storeDialog = true;
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
            this.stores = this.stores.filter((val) => val.id !== store.id);
            this.store = {};
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
    this.storeDialog = false;
    this.submitted = false;
  }

  saveStore() {
    this.submitted = true;
    if (!this.global) {
      this.store.company = this.company;
    }
    if (this.store.storeName?.trim()) {
      if (this.store.id) {
        this.storeService.updateStore(this.store).then((res: any) => {
          // this.stores.push(res);
          this.stores[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Store Updated',
            life: 3000,
          });
        });
      } else {
        this.storeService.createStore(this.store).then((res: any) => {
          this.stores.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Store Created',
            life: 3000,
          });
        });
      }
      this.stores = [...this.stores];
      this.storeDialog = false;
      this.store = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.stores.length; i++) {
      if (this.stores[i].id === id) {
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
              this.stores = data.content;
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
    //
    //     this.totalRecords = data.totalElements;
    //   }
    // });
    // }
    // this.storeService.getCompanies().then((data) => (this.companies = data));
    // this.storeService.getStates().then((data) => (this.states = data));
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from 'src/app/masters/stores/store';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';

import { StorageService } from '../stock/storage.service';
import { StoreCatalogService } from '../store-catalog/store-catalog.service';

import { StoreUserService } from '../store-user/store-user.service';
import { Inventory } from './inventory';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {
  inventoryDialog!: boolean;

  inventories: Inventory[] = [];

  inventory: Inventory = {};
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  selectedInventories!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;
  home!: MenuItem;
  items: MenuItem[] = [];

  storeCatalogs: any[] = [];
  store: Store = {};
  cols: any;
  totalRecords: any;
  inventoryData: any;
  constructor(
    private authService: AuthService,
    private inventoryService: InventoryService,
    private storeUserService: StoreUserService,
    private storeCatalaogService: StoreCatalogService,
    private storageService: StorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Inventories' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // var userId = this.authService.getUserId();
    // this.storeUserService.getStore(userId).then((data) => {
    //   this.store = data;
    //   this.inventoryService.getInventories(data.id).then((data) => {
    //     this.inventories = data;
    //
    //   });
    // this.storeCatalaogService.getStoreCatalogByStore(data.id).then((data) => {
    //   this.storeCatalogs = data;
    // });
    // });
    this.cols = [
      { field: '', header: '' },
      { field: 'product.name', header: 'Product Name' },
      { field: 'storage.name', header: 'Storage' },
      { field: 'inventory.quantity', header: 'Quantity' },
      { field: 'inventory.storage.qtyOnHand', header: 'Quantity On hand' },
    ];
  }
  openNew() {
    this.inventory = {};
    this.inventory.store = {};
    this.submitted = false;
    this.inventoryDialog = true;
  }

  deleteSelectedInventories() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Inventories?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventories = this.inventories.filter(
          (val) => !this.selectedInventories.includes(val)
        );
        this.selectedInventories = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Inventories Deleted',
          life: 3000,
        });
      },
    });
  }

  editInventory(inventory: Inventory) {
    this.inventory = { ...inventory };
    this.inventoryDialog = true;
  }

  hideDialog() {
    this.inventoryDialog = false;
    this.submitted = false;
  }

  saveInventory(type: string) {
    this.submitted = true;
    this.inventory.type = type;
    this.inventory.store = this.store;
    this.inventoryService
      .createInventory(this.inventory)
      .then((res: any) => {
        this.inventoryService
          .getInventories(this.store.id!, 0, 10, '', 'ASC', '')
          .then((data) => {
            this.inventories = data.content;
          });
        this.inventory.quantity = '';
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Inventory Created',
          life: 3000,
        });
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Inventory Create Failed',
          life: 3000,
        });
      });

    this.inventories = [...this.inventories];
    this.inventoryDialog = false;
    this.inventory = {};
  }

  getStorage() {
    this.storageService
      .getStorageByStoreCatalog(this.inventory.storeCatalog.id)
      .then((res: any) => (this.inventory.storage = res));
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.inventories.length; i++) {
      if (this.inventories[i].id === id) {
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
    this.getInventoryFilter(this.search);
  }
  getInventoryFilter(searchString: string) {
    this.search = searchString;
    var userId = this.authService.getUserId();
    this.storeUserService.getStore(userId).then((data) => {
      this.store = data;
      var filter = '';
      if (this.search !== '') {
        var filtercols = [
          'storeCatalog.product.name',
          'storage.name',
          'quantity',
          'storage.qtyOnHand',
        ];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.inventoryService
        .getInventories(
          this.store.id,
          this.pageNo,
          this.pageSize,
          this.sortField,
          this.sortDir,
          filter
        )
        .then((data) => {
          // this.inventories = data;
          if (data) {
            this.inventories = data.content;
            this.totalRecords = data.totalElements;
          }
        });
      this.storeCatalaogService
        .getStoreCatalogByStore(data.id, 0, 10, '', 'DESC', '')
        .then((data) => {
          this.storeCatalogs = data.content;
        });
    });
  }
}

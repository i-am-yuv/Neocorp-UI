import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { Inventory } from 'src/app/store/inventory/inventory';
import { InventoryService } from 'src/app/store/inventory/inventory.service';
import { StorageService } from 'src/app/store/stock/storage.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { DistributorCatalogService } from '../distributor-catalog/distributor-catalog.service';
import { DistributorUserService } from '../distributor-user/distributor-user.service';
import { Warehouse } from '../warehouses/warehouse';
import { WarehouseService } from '../warehouses/warehouse.service';
import { WhInventory } from './wh-inventory';

@Component({
  selector: 'app-wh-inventory',
  templateUrl: './wh-inventory.component.html',
  styleUrls: ['./wh-inventory.component.scss'],
})
export class WhInventoryComponent implements OnInit {
  inventoryDialog!: boolean;

  inventories: WhInventory[] = [];

  inventory: WhInventory = {};

  selectedInventories!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;

  distributorCatalogs: any[] = [];
  distributor: Distributor = {};
  warehouses: Warehouse[] = [];
  home!: MenuItem;
  items: MenuItem[] = [];
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';
  totalRecords: any;

  constructor(
    private authService: AuthService,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private distributorUserService: DistributorUserService,
    private distributorCatalaogService: DistributorCatalogService,
    private storageService: StorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Inventories' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    var userId = this.authService.getUserId();
    this.distributorUserService.getDistributorUser(userId).then((data) => {
      this.distributor = data.distributor;
      this.refreshData();
      this.warehouseService
        .getWarehousesByDistributor(data.distributor, 0, 10, '', 'DESC', '')
        .then((res: any) => {
          this.warehouses = res.content;
        });
      this.distributorCatalaogService
        .getbydistributor(data.distributor.id, 0, 10, '', 'DESC', '')
        .then((data) => {
          this.distributorCatalogs = data.content;
        });
    });
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
    this.getFilter(this.search);
  }
  getFilter(searchString: string) {
    this.search = searchString;
    var userId = this.authService.getUserId();
    this.distributorUserService.getDistributorUser(userId).then((data) => {
      this.distributor = data.distributor;
      // this.warehouseService.getWarehousesByDistributor(data.distributor, this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search).then((res: any) => {
      //   if (res) {
      //     this.inventories = res.content;
      //
      //     this.totalRecords = res.totalElements;
      //   }
      // });
      var filter = '';
      if (this.search !== '') {
        var filtercols = [
          'distributorCatalog.name',
          'storage.name',
          'quantity',
          'storage.qtyOnHand',
        ];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.inventoryService
        .getInventoriesByDistributor(
          this.distributor.id!,
          this.pageNo,
          this.pageSize,
          this.sortField,
          this.sortDir,
          filter
        )
        .then((res: any) => {
          if (res) {
            this.inventories = res.content;
            this.totalRecords = res.totalElements;
          }
        });
      // this.distributorCatalaogService.getbydistributor(data.distributor.id, this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search).then(data => {
      //   this.distributorCatalogs = data.content;
      //
      // });
    });
  }

  openNew() {
    this.inventory = {};
    // this.inventory.warehouse = this.distributor.warehouse;
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

  refreshData() {
    this.inventoryService
      .getInventoriesByDistributor(this.distributor.id!, 0, 10, '', 'DESC', '')
      .then((data: any) => {
        // this.inventoryService.getWhInventories(data.warehouse.id).then(data => {
        this.inventories = data.content;
      });
  }

  hideDialog() {
    this.inventoryDialog = false;
    this.submitted = false;
  }

  saveInventory(type: string) {
    this.submitted = true;
    this.inventory.type = type;
    this.inventoryService
      .createInventory(this.inventory)
      .then((res: any) => {
        // this.inventoryService.getWhInventories(this.distributor.warehouse?.id!).then(data => {
        //   this.inventories = data;
        // });
        this.refreshData();
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
      .getStorageByDistributorCatalog(
        this.inventory.distributorCatalog.id,
        this.inventory.warehouse.id
      )
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
}

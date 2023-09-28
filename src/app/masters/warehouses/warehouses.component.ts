import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Company } from '../companies/company';
import { Distributor } from '../distributors/distributor';
import { State } from '../states/state';
import { Warehouse } from './warehouse';
import { WarehouseService } from './warehouse.service';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss'],
})
export class WarehousesComponent implements OnInit {
  warehouseDialog!: boolean;

  warehouses!: Warehouse[];

  warehouse!: Warehouse;

  distributors!: Distributor[];

  selectedWarehouses!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;

  companies: Company[] = [];

  states: State[] = [];
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  totalRecords: any;

  constructor(
    private warehouseService: WarehouseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Warehouses' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.warehouseService.getWarehouses().then(data => this.warehouses = data);
    // this.warehouseService.getCompanies().then(data => this.companies = data);
    // this.warehouseService.getStates().then(data => this.states = data);
  }
  getDistributorsByCompany(company: any) {
    this.warehouseService
      .getDistributorsByCompany(company.id)
      .then((data) => (this.distributors = data));
  }
  openNew() {
    this.warehouse = {};
    this.submitted = false;
    this.warehouseDialog = true;
  }
  applyFilterGlobal($event: any, stringVal: any) {
    var searchString = ($event.target as HTMLInputElement).value;
    if (searchString.length > 0) {
      this.search = searchString;
      this.getFilter(searchString);
    } else {
      this.getFilter(searchString);
    }
  }
  loadPage(event: LazyLoadEvent) {
    this.warehouseService
      .getCompanies()
      .then((data) => (this.companies = data));
    this.warehouseService.getStates().then((data) => (this.states = data));
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
      var filtercols = ['storeName', 'company.companyName', 'storeLocation'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.warehouseService
      .getWarehouses(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        // this.warehouses = data;
        if (data) {
          this.warehouses = data.content;

          this.totalRecords = data.totalElements;
        }
      });
  }
  deleteSelectedWarehouses() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Warehouses?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedWarehouses.length;
        this.selectedWarehouses.forEach((warehouse: any) => {
          this.warehouseService.deleteWarehouse(warehouse).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.warehouses = this.warehouses.filter(
                  (val) => !this.selectedWarehouses.includes(val)
                );
                this.selectedWarehouses = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Warehouses Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'Warehouses Deletion Error, Please refresh and try again',
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

  editWarehouse(warehouse: Warehouse) {
    this.warehouse = { ...warehouse };
    this.warehouseDialog = true;
    this.getDistributorsByCompany(warehouse.company);
  }

  deleteWarehouse(warehouse: Warehouse) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + warehouse.warehouseName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.warehouseService
          .deleteWarehouse(warehouse)
          .then((data) => {
            this.warehouses = this.warehouses.filter(
              (val) => val.id !== warehouse.id
            );
            this.warehouse = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Warehouse Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Warehouse Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.warehouseDialog = false;
    this.submitted = false;
  }

  saveWarehouse() {
    this.submitted = true;

    if (this.warehouse.warehouseName?.trim()) {
      if (this.warehouse.id) {
        this.warehouseService
          .updateWarehouse(this.warehouse)
          .then((res: any) => {
            // this.warehouses.push(res);
            this.warehouses[this.findIndexById(res.id)] = res;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Warehouse Updated',
              life: 3000,
            });
          });
      } else {
        this.warehouseService
          .createWarehouse(this.warehouse)
          .then((res: any) => {
            this.warehouses.push(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Warehouse Created',
              life: 3000,
            });
          });
      }

      this.warehouses = [...this.warehouses];
      this.warehouseDialog = false;
      this.warehouse = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.warehouses.length; i++) {
      if (this.warehouses[i].id === id) {
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
}

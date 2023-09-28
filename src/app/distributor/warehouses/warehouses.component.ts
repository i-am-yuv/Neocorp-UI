import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from 'src/app/masters/companies/company';
import { State } from 'src/app/masters/states/state';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { DistributorUser } from '../distributor-user/distributor-user';
import { DistributorUserService } from '../distributor-user/distributor-user.service';

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

  warehouse: Warehouse = {};

  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  selectedWarehouses!: any;

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];

  @ViewChild('dt') dt: Table | undefined;

  companies: Company[] = [];

  states: State[] = [];

  currentdistributor: DistributorUser = {};
  totalRecords: any;

  constructor(
    private warehouseService: WarehouseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private distributorUserService: DistributorUserService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Warehouses' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // var userId = this.authService.getUserId();
    // this.distributorUserService.getDistributorUser(userId).then((data: DistributorUser) => {
    //   this.currentdistributor = data;
    //   this.warehouse.company = data.company;
    //   this.warehouse.distributor = data.distributor;
    //   this.warehouseService.getWarehousesByDistributor(data.distributor).then(data => this.warehouses = data);
    // });
    this.warehouseService
      .getCompanies()
      .then((data) => (this.companies = data));
    this.warehouseService
      .getStates(0, 28, 'stateName', 'ASC', this.search)
      .then((data) => (this.states = data));
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
    this.getWarehouseFilter(this.search);
  }
  getWarehouseFilter(searchString: string) {
    this.search = searchString;
    var userId = this.authService.getUserId();
    this.distributorUserService
      .getDistributorUser(userId)
      .then((data: DistributorUser) => {
        this.currentdistributor = data;
        this.warehouse.company = data.company;
        this.warehouse.distributor = data.distributor;
        var filter = '';
        if (this.search !== '') {
          var filtercols = [
            'warehouseName',
            'company.companyName',
            'warehouseLocation',
          ];
          filter = FilterBuilder.build(filtercols, this.search);
        }
        this.warehouseService
          .getWarehousesByDistributor(
            data.distributor,
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
      });
    // this.warehouseService.getCompanies().then(data => this.companies = data);
    // this.warehouseService.getStates().then(data => this.states = data);
  }
  openNew() {
    this.warehouse = {};
    this.warehouse.company = this.currentdistributor.company;
    this.warehouse.distributor = this.currentdistributor.distributor;
    this.submitted = false;
    this.warehouseDialog = true;
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
            this.warehouses.unshift(res);
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
}

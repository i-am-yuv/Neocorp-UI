import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreStockComponent } from 'src/app/distributor/store-stock/store-stock.component';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { StockTransaction } from '../stock-transactions/stock-transaction';
import { StoreUserService } from '../store-user/store-user.service';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
})
export class StorageComponent implements OnInit {
  stocks: any[] = [];
  stocksData: StockTransaction[] = [];
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  selectedStocks: any;

  @ViewChild('dt') dt: Table | undefined;
  home!: MenuItem;
  items: MenuItem[] = [];
  totalRecords: any;
  storeDt: any;

  constructor(
    private storeUserService: StoreUserService,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.storeUserService.getStore(this.authService.getUserId()).then((store) => {
    //   this.storageService.getStoreStorages(store.id).then((data: any) => {
    //     this.stocks = data;
    //
    //   })
    // });
    this.items = [{ label: 'Stock' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
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
    this.getStockFilter(this.search);
  }
  getStockFilter(searchString: string) {
    this.search = searchString;
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        var filter = '';
        if (this.search !== '') {
          var filtercols = [
            'storeCatalog.name',
            'storeCatalog.product.name',
            'storeCatalog.product.skuCode',
            'storeCatalog.store.storeName'
          ];
          filter = FilterBuilder.build(filtercols, this.search);
        }
        this.storageService
          .getStoreStorages(
            store.id,
            this.pageNo,
            this.pageSize,
            this.sortField,
            this.sortDir,
            filter
          )
          .then((data: any) => {
            this.stocks = data;
            if (data) {
              this.stocks = data.content;
              this.totalRecords = data.totalElements;
            }
          });
      });
  }
}

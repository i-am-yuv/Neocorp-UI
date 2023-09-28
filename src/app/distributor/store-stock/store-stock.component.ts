import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { StorageService } from 'src/app/store/stock/storage.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { DistributorUserService } from '../distributor-user/distributor-user.service';

@Component({
  selector: 'app-store-stock',
  templateUrl: './store-stock.component.html',
  styleUrls: ['./store-stock.component.scss'],
})
export class StoreStockComponent implements OnInit {
  stocks: any[] = [];

  selectedStocks: any;

  @ViewChild('dt') dt: Table | undefined;
  home!: MenuItem;
  items: MenuItem[] = [];
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';
  totalRecords: any;

  constructor(
    private distributorUserService: DistributorUserService,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Store Stock' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.distributorUserService.getDistributor().then((distributor) => {
    //   this.storageService.getAllStoreStorages(distributor.id).then((data: any) => {
    //     this.stocks = data.content;
    //   })
    // });
  }
  applyFilterGlobal($event: any, stringVal: any) {
    var searchString = ($event.target as HTMLInputElement).value;
    //this.dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
    if (searchString.length > 0) {
      this.search = searchString;
      this.getFilter(searchString);
    } else {
      this.getFilter(searchString);
    }
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
    this.distributorUserService.getDistributor().then((distributor) => {
      var filter = '';
      if (this.search !== '') {
        var filtercols = [
          'storeCatalog.store.storeName',
          'storeCatalog.product.name',
          'storeCatalog.product.skuCode',
          'qtyOnHand',
        ];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.storageService
        .getAllStoreStorages(
          distributor.id,
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
  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }
}

import { Component, OnInit } from '@angular/core';
import { MenuItem, LazyLoadEvent } from 'primeng/api';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { StoreUserService } from '../store-user/store-user.service';
import { StockTransaction } from './stock-transaction';
import { StockTransactionsService } from './stock-transactions.service';

@Component({
  selector: 'app-stock-transactions',
  templateUrl: './stock-transactions.component.html',
  styleUrls: ['./stock-transactions.component.scss'],
})
export class StockTransactionsComponent implements OnInit {
  transactions: StockTransaction[] = [];
  totalRecords: any;
  id: any;
  authService: any;
  loading!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';
  storeDt: any;

  constructor(
    private storeUserService: StoreUserService,
    private stockTransactionsService: StockTransactionsService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Stock Transactions' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.storeUserService.getCurrentStore().then((store) => {
    //   this.stockTransactionsService.getByStore(store.id).then((res: any) => {
    //     this.transactions = res;
    //   });
    // });
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
    this.storeUserService.getCurrentStore().then((store) => {
      var filter = '';
      if (this.search !== '') {
        var filtercols = [
          'storeCatalog.product.name',
          'movementDate',
          'quantity',
          'type',
          'orderLine.order.documentno',
        ];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.stockTransactionsService
        .getByStore(
          store.store.id,
          this.pageNo,
          this.pageSize,
          this.sortField,
          this.sortDir,
          filter
        )
        .then((res: any) => {
          // this.transactions = res;

          if (res) {
            this.transactions = res.content;
            this.totalRecords = res.totalElements;
          }
        });
    });
    // this.storeUserService.getCurrentStore().then((store) => {
    //   this.stockTransactionsService.getByStore(store.id,0,10,'','ASC','').then((res: any) => {
    //     this.transactions = res;
    //     this.id = store.id;
    //
    //     this.stockTransactionsService.getPagination(store.id, this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search)
    //       .then((data: any) => {
    //         this.storeDt = data;
    //
    //         if (data) {
    //           this.transactions = data.content;
    //           this.totalRecords = data.totalElements;
    //         }
    //       });
    //   });
    // });
  }
}

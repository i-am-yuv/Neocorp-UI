import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { StorageService } from 'src/app/store/stock/storage.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { DistributorUserService } from '../distributor-user/distributor-user.service';

@Component({
  selector: 'app-wh-storage',
  templateUrl: './wh-storage.component.html',
  styleUrls: ['./wh-storage.component.scss']
})
export class WhStorageComponent implements OnInit {

  stocks: any[] = [];

  selectedStocks: any;
  home!: MenuItem;
  items: MenuItem[] = [];
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  @ViewChild('dt') dt: Table | undefined;
  totalRecords: any;


  constructor(
    private distributorUserService: DistributorUserService,
    private storageService: StorageService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Stock' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.distributorUserService.getDistributorUser(this.authService.getUserId()).then((distributorUser) => {
    //   this.storageService.getStockByDistributor(distributorUser.distributor.id).then((data: any) => {
    //     this.stocks = data;
    //   })
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
    this.getFilter(this.search);
  }
  getFilter(searchString: string) {
    this.search = searchString;
    // this.storeService.getPagination(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search)
    //   .then((data: any) => {
    //     this.storeDt = data;
    // if(data){
    // 	this.stores = data.content;
    //     this.totalRecords = data.totalElements;
    // }

    //   });
    this.distributorUserService.getDistributorUser(this.authService.getUserId()).then((distributorUser) => {
      var filter = '';
      if (this.search !== '') {
        var filtercols = ['stockName', 'warehouse.warehouseName', 'qtyOnHand'];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.storageService.getStockByDistributor(distributorUser.distributor.id, this.pageNo, this.pageSize, this.sortField, this.sortDir, filter).then((data: any) => {
        this.stocks = data;
        if (data) {
          this.stocks = data.content;
          this.totalRecords = data.totalElements;
        }
      })
    });
  }
}
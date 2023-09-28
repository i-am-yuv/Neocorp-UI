import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { StoreUserService } from '../store-user/store-user.service';
import { GoodsReturn } from './goods-return';
import { GoodsReturnService } from './goods-return.service';

@Component({
  selector: 'app-goods-return',
  templateUrl: './goods-return.component.html',
  styleUrls: ['./goods-return.component.scss']
})
export class GoodsReturnComponent implements OnInit {

  goodsReturn: GoodsReturn = {};

  goodsReturnDialog!: boolean;

  goodsReturns!: GoodsReturn[];

  selectedGoodsReturns!: any;

  distributors: any[] = [];

  distributorCatalogs: any[] = [];
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];

  @ViewChild('dt') dt: Table | undefined;
  totalRecords: any;
  storeDt: any;

  constructor(private authService: AuthService,
    private storeUserService: StoreUserService,
    private goodsReturnService: GoodsReturnService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit(): void {
    // this.storeUserService.getStore(this.authService.getUserId()).then((store) => {
    //   this.goodsReturnService.getGoodsReturnByStore(store.id).then(data => this.goodsReturns = data);
    // });
    this.items = [
      { label: 'Goods Returns' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  openNew() {
    this.router.navigate(['/store/goods-return/create'])
  }

  deleteSelectedGoodsReturns() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected GoodsReturns?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedGoodsReturns.length;
        this.selectedGoodsReturns.forEach((goodsReturn: any) => {
          this.goodsReturnService.deleteGoodsReturn(goodsReturn).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.goodsReturns = this.goodsReturns.filter(val => !this.selectedGoodsReturns.includes(val));
                this.selectedGoodsReturns = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'GoodsReturns Deleted', life: 3000 });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'GoodsReturns Deletion Error, Please refresh and try again', life: 3000 });
              }
            }
          })
          counter++;
        });
      }
    });
  }

  editGoodsReturn(goodsReturn: GoodsReturn) {
    this.router.navigate(['/store/goods-return/edit/' + goodsReturn.id])
  }

  deleteGoodsReturn(goodsReturn: GoodsReturn) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + goodsReturn.documentno + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goodsReturnService.deleteGoodsReturn(goodsReturn).then((data) => {
          this.goodsReturns = this.goodsReturns.filter(val => val.id !== goodsReturn.id);
          // this.goodsReturn = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'GoodsReturn Deleted', life: 3000 });
        }).catch(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'GoodsReturn Deletion Error, Please refresh and try again', life: 3000 });
        });
      }
    });
  }



  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.goodsReturns.length; i++) {
      if (this.goodsReturns[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
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
    this.getGoodsReturnFilter(this.search);
  }
  getGoodsReturnFilter(searchString: string) {
    this.search = searchString;

    this.storeUserService.getStore(this.authService.getUserId()).then((store) => {
      var filter = '';
      if (this.search !== '') {
        var filtercols = ['documentno', 'purchaseOrder.documentnumber', 'returnDate', 'status'];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.goodsReturnService.getGoodsReturnByStore(store.id, this.pageNo, this.pageSize, this.sortField, this.sortDir, filter).then(data => {
        // this.goodsReturns = data
        if (data) {
          this.goodsReturns = data.content;
          this.totalRecords = data.totalElements;
        }
      });
    });

    // this.goodsReturnService.getPagination(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search)
    //   .then((data: any) => {
    //     this.storeDt = data;
    //     if (data) {
    //       this.goodsReturns = data.content;
    //       this.totalRecords = data.totalElements;
    //     }
    //   });
  }
}

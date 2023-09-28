import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { StoreUserService } from '../store-user/store-user.service';
import { GoodsReceipt } from './goods-receipt';
import { GoodsReceiptService } from './goods-receipt.service';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.scss'],
})
export class GoodsReceiptComponent implements OnInit {
  goodsReceipt: GoodsReceipt = {};

  goodsReceiptDialog!: boolean;

  goodsReceipts!: GoodsReceipt[];
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  selectedGoodsReceipts!: any;

  distributors: any[] = [];

  distributorCatalogs: any[] = [];

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];

  @ViewChild('dt') dt: Table | undefined;
  totalRecords: any;
  storeGoodsData: any;

  constructor(
    private authService: AuthService,
    private storeUserService: StoreUserService,
    private goodsReceiptService: GoodsReceiptService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = [{ label: ' Goods Receipts' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.storeUserService
    //   .getStore(this.authService.getUserId())
    //   .then((store) => {
    //     this.goodsReceiptService
    //       .getGoodsReceiptByStore(store.id)
    //       .then((data) => {
    //         this.goodsReceipts = data
    //
    //       });
    //   });
  }

  openNew() {
    this.router.navigate(['/store/goods-receipt/create']);
  }

  deleteSelectedGoodsReceipts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected GoodsReceipts?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedGoodsReceipts.length;
        this.selectedGoodsReceipts.forEach((goodsReceipt: any) => {
          this.goodsReceiptService.deleteGoodsReceipt(goodsReceipt).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.goodsReceipts = this.goodsReceipts.filter(
                  (val) => !this.selectedGoodsReceipts.includes(val)
                );
                this.selectedGoodsReceipts = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'GoodsReceipts Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'GoodsReceipts Deletion Error, Please refresh and try again',
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

  editGoodsReceipt(goodsReceipt: GoodsReceipt) {
    this.router.navigate(['/store/goods-receipt/edit/' + goodsReceipt.id]);
  }

  deleteGoodsReceipt(goodsReceipt: GoodsReceipt) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + goodsReceipt.documentno + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goodsReceiptService
          .deleteGoodsReceipt(goodsReceipt)
          .then((data) => {
            this.goodsReceipts = this.goodsReceipts.filter(
              (val) => val.id !== goodsReceipt.id
            );
            // this.goodsReceipt = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'GoodsReceipt Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'GoodsReceipt Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.goodsReceipts.length; i++) {
      if (this.goodsReceipts[i].id === id) {
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
    this.getGoodsReceiptFilter(this.search);
  }

  getGoodsReceiptFilter(searchString: string) {
    this.search = searchString;
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        var filter = '';
        if (this.search !== '') {
          var filtercols = [
            'documentno',
            'purchaseOrder.documentnumber',
            'receivedDate',
            'status',
          ];
          filter = FilterBuilder.build(filtercols, this.search);
        }
        this.goodsReceiptService
          .getGoodsReceiptByStore(
            store.id,
            this.pageNo,
            this.pageSize,
            this.sortField,
            this.sortDir,
            filter
          )
          .then((data) => {
            this.goodsReceipts = data;
            if (data) {
              this.goodsReceipts = data.content;
              this.totalRecords = data.totalElements;
            }
          });
      });
  }
}

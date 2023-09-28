import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Discount } from '../store-catalog/product-discount/discount';
import { DiscountService } from '../store-catalog/product-discount/discount.service';
import { StoreUserService } from '../store-user/store-user.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html'
})
export class DiscountComponent implements OnInit {

  discount: Discount = { typeValue: false };
  discounts: Discount[] = [];
  showDiscountForm: boolean = false;
  store: any;
  statuses: any[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  totalRecords: any;
  home!: MenuItem;
  items: MenuItem[] = [];

  constructor(
    private discountService: DiscountService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private storeUserService: StoreUserService
  ) { }

  ngOnInit(): void {
    // this.getDiscounts();
    this.items = [
      { label: 'Discounts' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  }
  // getDiscounts() {
  //   this.storeUserService.getStore(this.authService.getUserId()).then((store: any) => {
  //     this.store = store
  //     this.discountService.getDiscountsByStore(this.store.id).then((discounts: any) => this.discounts = discounts);
  //   })
  // }
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
    this.getDiscountFilter(this.search);
  }
  getDiscountFilter(searchString: string) {
    this.search = searchString;
    this.storeUserService.getStore(this.authService.getUserId()).then((store: any) => {
      this.store = store
      var filter = '';
      if (this.search !== '') {
        var filtercols = ['discountName', 'discountValue'];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.discountService.getDiscountsByStore(store.id, this.pageNo, this.pageSize, this.sortField, this.sortDir, filter).then((data: any) => {
        // if (data) {
        this.discounts = data.content;
        this.totalRecords = data.totalElements;
        // }
      }
      );
    })
  }

  onSave() {
    this.discount.store = this.store;
    if (this.discount.id) {
      this.discountService.updateDiscount(this.discount).then((discount: any) => {
        this.discount = {};
        // this.getDiscounts();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Discount Updated' });
      });
    } else {
      this.discountService.createDiscount(this.discount).then((discount: any) => {
        this.discount = {};
        // this.getDiscounts();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Discount Created' });
      });
    }
  }

  addNew() {
    this.discount = {};
  }

  edit(val: any) {
    this.discount = val;
    this.discount.validTill = new Date(val.validTill);
  }

  delete(discount: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + discount.discountName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.discountService.deleteDiscount(discount).then((data) => {
          this.discounts = this.discounts.filter(val => val.id !== discount.id);
          // this.customer = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Discount Deleted', life: 3000 });
        }).catch(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Discount Deletion Error, Please refresh and try again', life: 3000 });
        });
      }
    });
  }
 onRowEditInit(discount: any) {
    const validFromDate = new Date(discount.validFrom);
    const validTillDate = new Date(discount.validTill);
  
    if (!isNaN(validFromDate.getTime()) && !isNaN(validTillDate.getTime())) {
      
      discount.validFrom = validFromDate;
      discount.validTill = validTillDate;
    } else {
      
      console.log('One or both dates are invalid.');
      
      
      discount.validFrom = '';
      discount.validTill = '';
    }
  }
  

  
  /*onRowEditInit(discount: any) {
    discount.validFrom = new Date(discount.validFrom!);
    discount.validTill = new Date(discount.validTill!);
  }*/
  onRowEditSave(discount: any) {
    this.discount = discount;
    this.onSave();
    this.discount = { typeValue: false };
  }
  onRowEditCancel(discount: any, index: any) {
    if (!discount.id) {
      this.discounts.splice(index, 1);
    }
    this.discount = {};
  }

  newRow(): any {
    return { typeValue: false };
  }
}

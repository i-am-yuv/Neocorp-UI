import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Discount } from './discount';
import { DiscountService } from './discount.service';

@Component({
  selector: 'app-product-discount',
  templateUrl: './product-discount.component.html'
})
export class ProductDiscountComponent implements OnInit {

  @Input() storeCatalog: any;
  discount: Discount = { typeValue: false };
  discounts: Discount[] = [];
  showDiscountForm: boolean = false;

  constructor(
    private discountService: DiscountService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: any) {
    if (this.storeCatalog.id) {
      this.getDiscounts();
    }
  }
  getDiscounts() {
    this.discountService.getDiscounts(this.storeCatalog.id).then((discounts: any) => this.discounts = discounts);
  }

  onSubmit() {
    this.discount.storeCatalog = this.storeCatalog;
    if (this.discount.id) {
      this.discountService.updateDiscount(this.discount).then((discount: any) => {
        this.discount = {};
        this.getDiscounts();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Discount Updated' });
      });
    } else {
      this.discountService.createDiscount(this.discount).then((discount: any) => {
        this.discount = {};
        this.getDiscounts();
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
    this.discount.validFrom = new Date(val.validFrom);
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
}

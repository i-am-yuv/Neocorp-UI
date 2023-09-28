import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Order } from '../sales-order/order';

import { OrderService } from '../sales-order/order.service';
import { OrderLineService } from '../sales-order/orderlineservice';
import { StoreUserService } from '../store-user/store-user.service';

import { ReturnRefund } from './return-refund';
import { ReturnRefundService } from './return-refund.service';

@Component({
  selector: 'app-return-refund',
  templateUrl: './return-refund.component.html',
  styleUrls: ['./return-refund.component.scss'],
})
export class ReturnRefundComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any;

  statuses: any[] = ['CONFIRMED', 'CANCELLED', 'DRAFT'];

  status: string = 'CONFIRMED';
  store: any;
  activeStatus: string = 'CONFIRMED';
  home!: MenuItem;
  items: MenuItem[] = [];

  activeOrder: Order = {};
  orderLines: any[] = [];
  totalRecords: any;
  showRefundReturnDialog: boolean = false;

  returnRefund: ReturnRefund = {};
  returnRefunds: ReturnRefund[] = [];
  emailDetails: any;
  searchOrder: any;
  selectedCategory: any = null;
  categories: any[] = [{ name: 'Refund', key: 'R1' }];

  constructor(
    private orderService: OrderService,
    private orderLineService: OrderLineService,
    private storeUserService: StoreUserService,
    private authService: AuthService,
    private returnRefundService: ReturnRefundService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.selectedCategory = this.categories[0];
    this.getOrders();
    this.items = [{ label: 'Returns & Refunds' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  getOrders() {
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store: any) => {
        this.store = store;
        this.orderService
          .getOrders(store.id, this.activeStatus)
          .then((orders: any) => {
            this.orders = orders.content;
            this.totalRecords = orders.totalElements;
            if (this.orders.length > 0) {
              this.changeOrder(this.orders[0]);
            } else {
              this.activeOrder = {};
            }
          });
      });
  }

  saveRecord() {
    this.returnRefund.order = this.activeOrder;
    this.returnRefundService
      .createReturnRefund(this.returnRefund)
      .then((data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Record Created',
        });
        this.changeOrder(this.activeOrder);
        this.showRefundReturnDialog = false;
      })
      .catch((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000,
        });
      });
  }
  changeOrder(item: any) {
    this.activeOrder = item;
    this.getOrderLines();
    this.getReturnRefunds();
  }

  getOrderLines() {
    this.orderLineService
      .getByOrder(this.activeOrder.id)
      .then((orderLines: any) => {
        this.orderLines = orderLines;
      });
  }
  getReturnRefunds() {
    this.returnRefundService
      .getByOrder(this.activeOrder.id)
      .then((returnRefunds: any) => {
        this.returnRefunds = returnRefunds;
      });
  }
  getGrossTotal() {
    var total = 0;
    for (let p of this.orderLines) {
      if (p.qty && p.orderLineAmount) {
        total += p.orderLineAmount;
      }
    }
    return total;
  }
  getSubTotal() {
    var total = 0;
    for (let p of this.orderLines) {
      if (p.qty && p.orderLineAmount) {
        total += p.orderLineAmount - p.gst;
      }
    }
    return total;
  }

  getTaxTotal() {
    var total = 0;
    for (let p of this.orderLines) {
      total += p.gst;
    }
    return total;
  }

  openSidebar() {
    this.showRefundReturnDialog = true;
  }

  email(type: any) {
    type = this.activeOrder.documentno;
    this.returnRefundService
      .emailDetails(type, this.store.id, this.store.storeMail)
      .then((mail: any) => {
        this.emailDetails = mail;
      });
  }

  searchOrders(value: String) {
    if (value === null) {
      this.getOrders();
    } else {
      this.storeUserService
        .searchOrder(this.store.id, value, this.activeStatus)
        .then((order: any) => {
          this.orders = order.content;

          this.totalRecords = order.totalElements;

          if (this.orders.length > 0) {
            this.changeOrder(this.orders[0]);
          } else {
            this.activeOrder = {};
          }
        });
    }
  }
}

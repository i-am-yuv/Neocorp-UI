import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreUserService } from '../store-user/store-user.service';
import { PurchaseOrder } from './purchase-order';
import { PurchaseOrderLineService } from './purchase-order-line.service';
import { PurchaseOrderService } from './purchase-order.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
})
export class PurchaseOrderComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any;
  searchOrder: any;
  isSubscribed: boolean = true;
  statuses: any[] = [
    'DRAFT',
    'FORWARDED',
    'CONFIRMED',
    'PAID',
    'SHIPPED',
    'GRPROCESS',
    'COMPLETED',
    'CANCELLED',
  ];

  status: string = 'CONFIRMED';
  store: any;
  activeStatus: string = 'DRAFT';

  activeOrder: PurchaseOrder = {};
  orderLines: any[] = [];
  totalRecords: any;
  emailDetails: any;
  home!: MenuItem;
  items: MenuItem[] = [];

  constructor(
    private purchaseOrderLineService: PurchaseOrderLineService,
    private storeUserService: StoreUserService,
    private purchaseOrderService: PurchaseOrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getOrders();
    this.isSubscribed = this.getSubscriptionStatus();
    this.items = [{ label: 'Purchase Order' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }
  getSubscriptionStatus() {
    return false;
  }
  getOrders() {
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store: any) => {
        this.store = store;
        this.isSubscribed = this.store.company?.subscriptionActive;
        //this.isSubscribed = true;
        this.purchaseOrderService
          .getByStore(store.id, this.activeStatus)
          .then((orders: any) => {
            this.orders = orders.content;
            console.log();
            this.totalRecords = orders.totalElements;
            if (this.orders.length > 0) {
              this.changeOrder(this.orders[0]);
            } else {
              this.activeOrder = {};
            }
          });
      });
  }

  changeOrder(item: any) {
    this.activeOrder = item;
    this.getOrderLines();
  }

  getOrderLines() {
    this.purchaseOrderLineService
      .getByPurchaseOrder(this.activeOrder)
      .then((orderLines: any) => {
        this.orderLines = orderLines;
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

  searchOrders(value: String) {
    // this.getOrders.length

    if (value === null) {
      this.getOrders();
    } else {
      this.purchaseOrderService
        .searchOrder(this.store.id, value, this.activeStatus)
        .then((order: any) => {
          this.orders = order.content;

          this.totalRecords = order.totalElements;
          //
          //  if (this.orders.length > 0) {
          //    this.changeOrder(this.orders[0]);
          //  } else {
          //    this.activeOrder = {};
          //  }
        });
    }
  }

  email(type: string) {
    this.purchaseOrderService
      .emailDetails(type, this.store.id, this.store.storeMail)
      .then((mail: any) => {
        this.emailDetails = mail;
      });
  }
}

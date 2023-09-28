import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { PurchaseOrder } from 'src/app/store/purchase-order/purchase-order';
import { PurchaseOrderLineService } from 'src/app/store/purchase-order/purchase-order-line.service';
import { PurchaseOrderService } from 'src/app/store/purchase-order/purchase-order.service';
import { DistributorUserService } from '../distributor-user/distributor-user.service';
import { SalesRequestService } from './sales-request.service';

@Component({
  selector: 'app-sales-request',
  templateUrl: './sales-request.component.html',
  styleUrls: ['./sales-request.component.scss'],
})
export class SalesRequestComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any;
  searchOrder: any;

  statuses: any[] = [
    'FORWARDED',
    'CONFIRMED',
    'PAID',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED',
  ];

  status: string = 'CONFIRMED';
  distributor: Distributor = {};
  activeStatus: string = 'FORWARDED';

  activeOrder: PurchaseOrder = {};
  orderLines: any[] = [];
  totalRecords: any;
  home!: MenuItem;
  items: MenuItem[] = [];
  id: any | undefined;

  constructor(
    private purchaseOrderLineService: PurchaseOrderLineService,
    private distributorUserService: DistributorUserService,
    private purchaseOrderService: PurchaseOrderService,
    private authService: AuthService,
    private salesReqService: SalesRequestService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Sales Requests' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    this.getOrders();
  }

  getOrders() {
    this.distributorUserService
      .getDistributorUser(this.authService.getUserId())
      .then((distributorUser: any) => {
        this.distributor = distributorUser.distributor;
        this.purchaseOrderService
          .getByDistributor(this.distributor.id, this.activeStatus)
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
  changeOrder(item: any) {
    this.activeOrder = item;
    this.getOrderLines();
  }

  getOrderLines() {
    this.id = this.activeOrder.id;
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
    if (value === null) {
      this.getOrders();
    } else {
      this.salesReqService
        .searchOrder(this.activeOrder.id, value, this.activeStatus)
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

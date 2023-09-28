import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { DistributorUserService } from '../distributor-user/distributor-user.service';
import { SalesInvoice } from './sales-invoice';
import { SalesInvoiceLineService } from './sales-invoice-line.service';
import { SalesInvoiceService } from './sales-invoice.service';

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.scss'],
})
export class SalesInvoicesComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any;
  home!: MenuItem;
  items: MenuItem[] = [];

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
  activeStatus: string = 'COMPLETED';

  activeOrder: SalesInvoice = {};
  orderLines: any[] = [];
  totalRecords: any;
  searchOrder: any;
  id: any;
  constructor(
    private salesInvoiceLineService: SalesInvoiceLineService,
    private distributorUserService: DistributorUserService,
    private salesInvoiceService: SalesInvoiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Sales Invoices' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    this.getOrders();
  }

  getOrders() {
    this.distributorUserService
      .getDistributorUser(this.authService.getUserId())
      .then((distributorUser: any) => {
        this.distributor = distributorUser.distributor;
        this.salesInvoiceService
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

  // getOrderLines() {
  //   this.id = this.activeOrder.purchaseOrder?.id;
  //
  //   this.salesInvoiceLineService.getBySalesInvoice(this.id).then((orderLines: any) => {
  //     this.orderLines = orderLines;
  //
  //   })
  // }
  getOrderLines() {
    this.salesInvoiceLineService
      .getBySalesInvoice(this.activeOrder.id)
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
      this.salesInvoiceLineService
        .searchPurchaseOrder(this.activeOrder.id, value, this.activeStatus)
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

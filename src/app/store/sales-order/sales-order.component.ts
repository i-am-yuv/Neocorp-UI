import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from 'src/app/masters/stores/store';
import { StoreUser } from '../store-user/store-user';
import { StoreUserService } from '../store-user/store-user.service';
import { Order } from './order';
import { OrderService } from './order.service';
import { OrderLineService } from './orderlineservice';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss'],
})
export class SalesOrderComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any;

  statuses: any[] = ['CONFIRMED', 'CANCELLED', 'DRAFT', 'FORWARDED'];

  status: string = 'CONFIRMED';
  store: any;
  activeStatus: string = 'CONFIRMED';
  token: any;

  activeOrder: Order = {};
  orderLines: any[] = [];
  totalRecords: any;
  searchOrder: any;
  emailDetails: any;
  home!: MenuItem;
  items: MenuItem[] = [];
  // storeDetails! : Store ;

  constructor(
    private orderService: OrderService,
    private orderLineService: OrderLineService,
    private storeUserService: StoreUserService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.items = [{ label: 'Sales order' }];
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
            //
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
    this.orderLineService
      .getByOrder(this.activeOrder.id)
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
    return Math.round(total / 100) * 100;
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

  email(type: string) {
    this.token = sessionStorage.getItem('token');

    this.orderService
      .emailDetails(
        this.token,
        type,
        this.activeOrder.id,
        this.activeOrder.store?.storeMail
      )
      .then((mail: any) => {
        this.emailDetails = mail;
      });
  }

  confirmOrder() {
    this.orderService
      .processConfirmOrder('confirm', this.activeOrder.id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Order confirmed',
          life: 3000,
        });
        this.router.navigate(['/store/order']);
      });
  }

  cancelOrder() {
    this.orderService
      .processCancelOrder('cancel', this.activeOrder.id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Order cancelled',
          life: 3000,
        });
        this.router.navigate(['/store/order']);
      });
  }
}

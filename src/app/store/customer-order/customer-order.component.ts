import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from 'src/app/masters/stores/store';
import { StoreUser } from '../store-user/store-user';
import { StoreUserService } from '../store-user/store-user.service';
import { Order } from './order';
import { OrderService } from './order.service';
import { OrderLineService } from './orderlineservice';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.scss'],
})
export class CustomerOrderComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any;

  statuses: any[] = ['FORWARDED', 'CONFIRMED', 'PAID', 'DELIVERY', 'COMPLETED'];

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
  typeofRequest: any;
  // storeDetails! : Store ;

  constructor(
    private orderServices: OrderService,
    private orderLineServices: OrderLineService,
    private storeUserService: StoreUserService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getOrders();
    this.items = [{ label: 'Customer order' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }
  confirmOrder() {}
  cancelOrder() {}
  getOrders() {
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store: any) => {
        this.store = store;
        console.log(store.id + '   ' + this.activeStatus);
        this.typeofRequest = this.activeStatus;
        this.orderServices
          .getOrders(store.id, this.activeStatus)
          .then((orders: any) => {
            this.orders = orders.content;
            //  console.log(this.orders);
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
    this.orderLineServices
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
    // console.log(this.activeOrder.id);
    // console.log(type);
    // console.log(this.activeOrder.store?.storeMail);
    // console.log(this.activeOrder.store.id);
    this.token = sessionStorage.getItem('token');
    // console.log(this.token);
    this.orderServices
      .emailDetails(
        this.token,
        type,
        this.activeOrder.id,
        this.activeOrder.store?.storeMail
      )
      .then((mail: any) => {
        // console.log("enter");
        // console.log(mail);
        this.emailDetails = mail;
        // console.log(this.emailDetails);
      });
  }
}

import { MenuItem, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { PurchaseOrder } from 'src/app/store/purchase-order/purchase-order';
import { PurchaseOrderLineService } from 'src/app/store/purchase-order/purchase-order-line.service';
import { PurchaseOrderService } from 'src/app/store/purchase-order/purchase-order.service';
import { DistributorUserService } from '../distributor-user/distributor-user.service';

@Component({
  selector: 'app-distributor-orders',
  templateUrl: './distributor-orders.component.html',
  styleUrls: ['./distributor-orders.component.scss'],
})
export class DistributorOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any;
  home!: MenuItem;
  items: MenuItem[] = [];
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
  activeStatus: string = 'SHIPPED';

  activeOrder: PurchaseOrder = {};
  orderLines: any[] = [];
  totalRecords: any;
  id: any;

  constructor(
    private purchaseOrderLineService: PurchaseOrderLineService,
    private distributorUserService: DistributorUserService,
    private purchaseOrderService: PurchaseOrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'Sales Orders'},
    ];
    this.home = {icon: 'pi pi-home', routerLink: '/dashboard'};
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
      .getByPurchaseOrder(this.id)
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

  sendEmail() {}

  searchOrders(value: String){
    if(value === null){
    this.getOrders();
   }else{
     this.distributorUserService.searchPurchaseOrder(this.distributor.id, value, this.activeStatus).then((order : any) =>{
       this.orders = order.content;
       this.totalRecords = order.totalElements;
       if (this.orders.length > 0) {
         this.changeOrder(this.orders[0]);
       } else {
         this.activeOrder = {};
       } 
     })
   } 
  }
}

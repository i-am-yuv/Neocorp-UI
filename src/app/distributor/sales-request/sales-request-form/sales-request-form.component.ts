import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeIcons,
} from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { PurchaseOrder } from 'src/app/store/purchase-order/purchase-order';
import { PurchaseOrderLine } from 'src/app/store/purchase-order/purchase-order-line';
import { PurchaseOrderLineService } from 'src/app/store/purchase-order/purchase-order-line.service';
import { PurchaseOrderService } from 'src/app/store/purchase-order/purchase-order.service';

@Component({
  selector: 'app-sales-request-form',
  templateUrl: './sales-request-form.component.html',
  styleUrls: ['./sales-request-form.component.scss'],
})
export class SalesRequestFormComponent implements OnInit {
  id: string | null = '';

  items: MenuItem[] = [];
  home: MenuItem = {};

  poForm!: FormGroup;

  currentuser: any = {};
  selectedStore: any = {};
  distributors: Distributor[] = [];
  selectedDistributor: any = {};
  purchaseOrderLines: any[] = [];

  editing: any;
  products: any[] = [];
  newRecord: boolean = false;
  activeOrder: PurchaseOrder = {};
  events: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private purchaseOrderLineService: PurchaseOrderLineService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'Sales Requests', routerLink: '/distributor/sales-requests' },
    ];
    this.home = {
      icon: 'pi pi-home',
      routerLink: '/distributor/sales-requests',
    };
    this.id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    this.getData();
  }

  initForm() {
    this.poForm = this.fb.group({
      id: [''],
      store: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        }),
      }),
      distributor: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        }),
      }),
      dueDate: [''],
    });
    this.events = [
      {
        status: 'Ordered',
        date: '15/10/2020 10:30',
        icon: PrimeIcons.SHOPPING_CART,
        color: '#9C27B0',
        image: 'game-controller.jpg',
      },
      {
        status: 'Processing',
        date: '15/10/2020 14:00',
        icon: PrimeIcons.COG,
        color: '#673AB7',
      },
      {
        status: 'Shipped',
        date: '15/10/2020 16:15',
        icon: PrimeIcons.ENVELOPE,
        color: '#FF9800',
      },
      {
        status: 'Delivered',
        date: '16/10/2020 10:00',
        icon: PrimeIcons.CHECK,
        color: '#607D8B',
      },
    ];
  }
  getData() {
    this.authService.getUser().then((user: any) => {
      this.currentuser = user;
      if (this.id) {
        this.getOrder();
      }
      // this.purchaseOrderService.getStores(user.company.id).then((stores: any) => this.stores = stores)
    });
  }
  getOrder() {
    if (this.id) {
      this.purchaseOrderService
        .getOrder(this.id)
        .then((order: PurchaseOrder) => {
          order.dueDate = order.dueDate ? new Date(order.dueDate) : undefined;
          this.activeOrder = order;
          this.selectedStore = order.store;
          this.selectedDistributor = order.distributor;
          this.poForm.patchValue(order);
          this.getLines(order);
        });
    }
  }
  getLines(order: PurchaseOrder) {
    this.purchaseOrderLineService
      .getByPurchaseOrder(order)
      .then((data: any) => {
        //console.log(JSON.stringify(data));
        this.purchaseOrderLines = data;
      });
  }
  formSubmit() {
    var poFormVal = this.poForm.value;
    if (poFormVal.id) {
    } else {
      delete poFormVal.id;
      this.purchaseOrderService
        .createPurchaseOrder(poFormVal)
        .then((data: any) => {
          this.poForm.patchValue = { ...data };
        });
    }
  }

  setSelectedDistributor() {
    var distributor = this.distributors.find(
      (t) => t.id === this.poForm.value.distributor.id
    );
    this.selectedDistributor = distributor ? distributor : {};
    if (this.selectedDistributor.id) {
      this.purchaseOrderService
        .getDistributorsProducts(this.selectedDistributor)
        .then((products: any) => {
          this.products = products;
        });
    }
  }
  onRowEditInit(poline: PurchaseOrderLine) {}
  onRowEditSave(poline: PurchaseOrderLine) {
    poline.purchaseOrder.id = this.id;
    this.newRecord = false;
    var _poline = poline;
    if (_poline.id) {
      this.purchaseOrderLineService
        .updatePurchaseOrderLine(poline)
        .then((line: any) => {
          _poline = line;
          this.getOrder();
        });
    } else {
      this.purchaseOrderLineService
        .createPurchaseOrderLine(poline)
        .then((line: any) => {
          _poline = line;
          this.getOrder();
        });
    }
  }
  onRowEditCancel(poline: any, index: any) {
    poline;
    if (this.newRecord) {
      this.purchaseOrderLines.splice(index, 1);
    }
    this.newRecord = false;
  }

  newRow(): any {
    return { product: {}, quantity: 1 };
  }

  setLineValues(poline: PurchaseOrderLine, confirmedQty: number) {
    var _poline = poline;
    _poline.quantity = confirmedQty;
    _poline.linetotal = poline.unitprice! * confirmedQty;
    var rate = poline.product.taxRate.gst;
    _poline.gst =
      Math.round(_poline.linetotal * (rate / (100 + rate)) * 100) / 100;
    return _poline;
  }

  setLineQtyValues(event: any, poline: PurchaseOrderLine, ri: any) {
    var _poline = this.setLineValues(poline, event.value);
    this.purchaseOrderLines[ri] = _poline;
  }

  confirm() {
    this.purchaseOrderService
      .processOrder('confirm', this.activeOrder.id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Purchase Order sent to Store',
          life: 3000,
        });
        this.router.navigate(['/distributor/sales-requests']);
      });
  }

  ship() {
    this.purchaseOrderService
      .createGoodsShipment(this.activeOrder.id!)
      .then((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Purchase Order Shipment Created',
          life: 3000,
        });
        this.router.navigate(['/distributor/goods-shipment/edit/' + res.id]);
      });
  }

  cancelOrder() {
    this.purchaseOrderService
      .processOrder('cancel', this.activeOrder.id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Purchase Order Cancelled',
          life: 3000,
        });
        this.router.navigate(['/distributor/sales-requests']);
      });
  }

  cancel() {
    this.router.navigate(['/distributor/sales-requests']);
  }
}

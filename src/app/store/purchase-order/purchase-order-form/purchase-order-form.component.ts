import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeIcons,
} from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { StoreUserService } from '../../store-user/store-user.service';
import { PurchaseOrder } from '../purchase-order';
import { PurchaseOrderLine } from '../purchase-order-line';
import { PurchaseOrderLineService } from '../purchase-order-line.service';
import { PurchaseOrderService } from '../purchase-order.service';

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.scss'],
})
export class PurchaseOrderFormComponent implements OnInit {
  id: string | null = '';

  items: MenuItem[] = [];
  home: MenuItem = {};

  poForm!: FormGroup;

  currentuser: any = {};
  selectedStore: any = {};
  distributors: Distributor[] = [];
  selectedDistributor: Distributor = {};
  purchaseOrderLines: any[] = [];

  editing: any;
  products: any[] = [];
  newRecord: boolean = false;
  activeOrder: PurchaseOrder = { status: 'DRAFT' };

  events: any[] = [];

  viewOnly: boolean = false;
  showPaymentDialog: boolean = false;
  paymentDone: boolean = false;
  upiUrl: string | undefined;
  subscriptionActive!: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private purchaseOrderLineService: PurchaseOrderLineService,
    private storeUserService: StoreUserService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'Purchase Orders', routerLink: '/store/purchase-orders' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/store/purchase-orders' };
    this.id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    this.getData();
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        this.subscriptionActive = store.company.subscriptionActive;
      });
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
      },
      {
        status: 'Processing',
        date: '',
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
      this.purchaseOrderService.getStore(user.id).then((store: any) => {
        this.selectedStore = store;
        this.getOrder();
        this.poForm.controls['store'].patchValue(store);
        this.purchaseOrderService
          .getDistributorsByStore(store.id)
          .then((distributors: any) => {
            this.distributors = distributors;
            this.setSelectedDistributor();
          });
      });

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
          if (this.activeOrder.status !== 'DRAFT') {
            this.viewOnly = true;
          }
          this.poForm.patchValue(order);
          this.setSelectedDistributor();
          this.getLines(order);
        });
    }
  }
  getLines(order: PurchaseOrder) {
    this.purchaseOrderLineService
      .getByPurchaseOrder(order)
      .then((data: any) => {
        if (data) {
          this.purchaseOrderLines = data;
        }
      });
  }
  formSubmit() {
    //
    var poFormVal = this.poForm.value;

    //alert(JSON.stringify(this.poForm.value));
    if (poFormVal.id) {
      this.purchaseOrderService
        .updatePurchaseOrder(poFormVal)
        .then((data: any) => {
          this.poForm.patchValue = { ...data };
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Purchase Order Updated',
          });
        });
    } else {
      delete poFormVal.id;
      this.purchaseOrderService
        .createPurchaseOrder(poFormVal)
        .then((data: any) => {
          this.poForm.patchValue = { ...data };
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Purchase Order Created',
          });
          this.router.navigate(['/store/purchase-orders/edit/' + data.id]);
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
  islineAvaliable: boolean = false;
  onRowEditInit(poline: PurchaseOrderLine) {}
  onRowEditSave(poline: PurchaseOrderLine) {
    poline['purchaseOrder'] = {};
    poline['purchaseOrder']['id'] = this.id;
    this.newRecord = false;
    var _poline = poline;
    //
    if (_poline.id) {
      this.purchaseOrderLineService
        .updatePurchaseOrderLine(poline)
        .then((line: any) => {
          _poline = line;
          this.activeOrder.grosstotal = poline.linetotal;
          // this.getOrder();
        });
    } else {
      alert(poline);
      this.purchaseOrderLineService
        .createPurchaseOrderLine(poline)
        .then((line: any) => {
          _poline = line;
          this.getOrder();
        });
    }
    this.islineAvaliable = true;
  }
  onRowEditCancel(poline: any, index: any) {
    if (this.newRecord) {
      this.purchaseOrderLines.splice(index, 1);
    }
    this.newRecord = false;
    this.islineAvaliable = false;
  }

  newRow(): any {
    return { product: {}, quantity: 1 };
  }
  delete(poline: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + poline.product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.purchaseOrderLineService
          .deletePurchaseOrderLine(poline.id)
          .then((data) => {
            this.purchaseOrderLines = this.purchaseOrderLines.filter(
              (val) => val.id !== poline.id
            );
            this.getOrder();
            // this.customer = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'PO Line Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'PO Line Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  setLineValues(poline: PurchaseOrderLine) {
    var dc = this.products.find((t) => t.product.id === poline.product.id);
    poline.unitprice = dc.sellingPrice;

    poline.quantity = poline.quantity ? poline.quantity : 1;

    poline.linetotal = dc.sellingPrice * poline.quantity;

    var rate = dc.product.taxRate.gst;
    poline.gst =
      Math.round(poline.linetotal * (rate / (100 + rate)) * 100) / 100;
  }
  isquantity: boolean = false;
  setLineQtyValues(e: any, poline: PurchaseOrderLine) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      poline.quantity = e.value;
      this.setLineValues(poline);
      this.isquantity = true;
    }
  }

  forward() {
    this.purchaseOrderService
      .processOrder('forward', this.activeOrder.id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Purchase Order Forwarded to Distributor',
          life: 3000,
        });
        this.router.navigate(['/store/purchase-orders']);
      });
  }

  confirmPaid() {
    this.purchaseOrderService
      .processOrder('paid', this.activeOrder.id)
      .then(() => {
        this.paymentDone = true;
      });
  }

  openPayment() {
    this.purchaseOrderService
      .getPaymentUrl(
        this.activeOrder.id,
        this.selectedDistributor.id,
        this.selectedStore.storeName,
        this.activeOrder.grosstotal
      )
      .then((res: any) => {
        this.showPaymentDialog = true;
        this.upiUrl = res;
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Distributor is not configured the payment method',
          life: 3000,
        });
      });
  }

  closePaymentDialog() {
    this.showPaymentDialog = false;
    this.router.navigate(['/store/purchase-orders']);
  }

  createGoodsReceipt() {
    this.purchaseOrderService
      .createGoodsReceipt(this.activeOrder.id!)
      .then((data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Goods Receipt Created',
          life: 3000,
        });
        this.router.navigate(['/store/goods-receipt/edit/' + data.id]);
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
        this.router.navigate(['/store/purchase-orders']);
      });
  }
}

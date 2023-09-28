import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { PurchaseOrder } from 'src/app/store/purchase-order/purchase-order';
import { PurchaseOrderLine } from 'src/app/store/purchase-order/purchase-order-line';

import { DistributorCatalog } from '../../distributor-catalog/distributor-catalog';
import { Warehouse } from '../../warehouses/warehouse';
import { GoodsShipment } from '../goods-shipment';
import { GoodsShipmentLine } from '../goods-shipment-line';
import { GoodsShipmentLineService } from '../goods-shipment-line.service';
import { GoodsShipmentService } from '../goods-shipment.service';

@Component({
  selector: 'app-goods-shipment-form',
  templateUrl: './goods-shipment-form.component.html',
  styleUrls: ['./goods-shipment-form.component.scss']
})
export class GoodsShipmentFormComponent implements OnInit {

  form!: FormGroup;

  goodsShipments: GoodsShipment[] = [];
  goodsShipment: GoodsShipment = {};
  orders: PurchaseOrder[] = [];
  warehouses: Warehouse[] = [];

  id: string | null = '';
  goodsShipmentLines: GoodsShipmentLine[] = [];
  goodsShipmentLine: GoodsShipmentLine = {};
  newRecord: boolean = false;

  distributorCatalogs: DistributorCatalog[] = [];
  distributor: any;
  poLines: PurchaseOrderLine[] = [];
  readOnly: boolean = false;
  home!: MenuItem;
  items: MenuItem[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private goodsShipmentService: GoodsShipmentService,
    private goodsShipmentLineService: GoodsShipmentLineService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.items = [
      {
        label: ' Manage Goods Shipments',
        icon: 'pi pi-fw pi-chevron-left',
        routerLink: ['/distributor/goods-shipment'],
      }
    ];
    // this.home = {icon: 'pi pi-chevron-left', routerLink: '/distributor/goods-shipment'};
    this.initForm();
    this.id = this.route.snapshot.paramMap.get('id');
  }
  initForm() {
    this.form = this.fb.group({
      id: '',
      purchaseOrder: this.fb.group({ id: this.fb.nonNullable.control('', { validators: Validators.required }) }),
      distributor: this.fb.group({ id: this.fb.nonNullable.control('', { validators: Validators.required }) }),
      documentno: [''],
      shipmentDate: [new Date()],
      warehouse: this.fb.group({ id: this.fb.nonNullable.control('', { validators: Validators.required }) }),
      status: ['DRAFT']
    });
    this.authService.getUser().then((user: any) => {
      this.goodsShipmentService.getDistributor(user.id).then((distributor: any) => {
        this.distributor = distributor;
        this.form.controls['distributor'].patchValue(distributor);
        this.goodsShipmentService.getWarehouses(distributor.id).then((res: any) => {
          this.warehouses = res;
        })
        this.goodsShipmentService.getOrders(distributor.id, 'GSPROCESS,PAID').then((orders) => { this.orders = orders });
        if (this.id) {
          this.getGoodsShipment();
        }
      })
    });

  }

  saveGoodsShipment() {
    if (!this.id) {
      this.goodsShipmentService.createGoodsShipment(this.form.value).then((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goods Receipt Created' });
        this.router.navigate(['/distributor/goods-shipment/edit/' + res.id]);
      })
    } else {
      this.goodsShipmentService.updateGoodsShipment(this.form.value).then((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goods Receipt Updated' });
        this.getGoodsShipment();
      })
    }
  }

  getLines(goodsShipment: GoodsShipment) {
    this.goodsShipmentLineService.getByGoodsShipment(goodsShipment.id!).then((data: any) => {
      this.goodsShipmentLines = data;
    })
  }

  getGoodsShipment() {
    this.goodsShipmentService.getGoodsShipment(this.id!).then((res: any) => {
      this.readOnly = (res.status != "DRAFT");
      this.goodsShipment = res;
      res.shipmentDate = new Date(res.shipmentDate);
      this.form.patchValue({ ...res });
      this.getGoodsShipmentLines(res.id);
      if (res.purchaseOrder) {
        this.getPurchaseOrderLines(res.purchaseOrder.id);
      }
      this.goodsShipmentLineService.getDistributorCatalogByDistributor(this.distributor.id).then((data: any) => {
        this.distributorCatalogs = data;
      });
    })
  }
  getPurchaseOrderLines(orderId: string) {
    this.goodsShipmentLineService.getPoLines(orderId).then((data: any) => {
      this.poLines = data;
      var stcs: any[] = [];
      this.poLines.forEach((line: any) => {
        var stc = this.distributorCatalogs.find((t: any) => t.product.id === line.product.id);
        if (stc) {
          stcs.push(stc);
        }
      });
      this.distributorCatalogs = stcs;
    });
  }
  getGoodsShipmentLines(poId: string) {
    this.goodsShipmentLineService.getByGoodsShipment(poId).then((data: any) => {
      this.goodsShipmentLines = data;
    });
  }

  onRowEditInit(goodsShipmentLine: GoodsShipmentLine) {
    this.newRecord = false;
  }
  onRowEditSave(goodsShipmentLine: GoodsShipmentLine) {
    this.newRecord = false;
    var _goodsShipmentLine = goodsShipmentLine;
    _goodsShipmentLine.goodsShipment = { id: this.id! };
    if (_goodsShipmentLine.id) {
      this.goodsShipmentLineService.updateGoodsShipmentLine(_goodsShipmentLine).then((line: any) => {
        _goodsShipmentLine = line;
        this.getGoodsShipment();
      });
    } else {
      this.goodsShipmentLineService.createGoodsShipmentLine(_goodsShipmentLine).then((line: any) => {
        _goodsShipmentLine = line;
        this.getGoodsShipment();
      });
    }
  }
  onRowEditCancel(goodsShipmentLine: any, index: any) {
    if (!goodsShipmentLine.id) {
      this.goodsShipmentLines.splice(index, 1);
    }
    this.newRecord = false;
  }

  newRow(): any {
    return { distributorCatalog: {}, orderedQty: 1 };
  }
  delete(goodsShipmentLine: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + goodsShipmentLine.distributorCatalog.product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goodsShipmentLineService.deleteGoodsShipmentLine(goodsShipmentLine.id).then((data) => {
          this.goodsShipmentLines = this.goodsShipmentLines.filter(val => val.id !== goodsShipmentLine.id);
          // this.customer = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Goods Receipt Deleted', life: 3000 });
        }).catch(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Goods Receipt Error, Please refresh and try again', life: 3000 });
        });
      }
    });
  }

  setLineValues(goodsShipmentLine: GoodsShipmentLine) {
    if (goodsShipmentLine.distributorCatalog && goodsShipmentLine.distributorCatalog.product) {
      var _pol = this.poLines.find(t => t.product.id === goodsShipmentLine.distributorCatalog!.product!.id);
      goodsShipmentLine.purchaseOrderLine = _pol;
      goodsShipmentLine.orderedQty = _pol?.orderedQuantity;
      goodsShipmentLine.confirmedQty = _pol?.confirmedQuantity;
      goodsShipmentLine.shippedQty = _pol?.confirmedQuantity;
      goodsShipmentLine.receivedQty = _pol?.receivedQuantity;
    }
  }

  setLineQtyValues($event: any, grLine: GoodsShipmentLine) {
    grLine.shippedQty = grLine.confirmedQty;
  }

  processGoodsShipment() {
    this.goodsShipmentService.processGoodsShipment(this.id).then((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Goods Receipt Processed, Stock Added.', life: 3000 });
      this.router.navigate(['/distributor/goods-shipment']);
    })
  }

}

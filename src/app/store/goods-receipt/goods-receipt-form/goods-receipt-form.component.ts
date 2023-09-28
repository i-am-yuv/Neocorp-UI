import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { PurchaseOrder } from '../../purchase-order/purchase-order';
import { PurchaseOrderLine } from '../../purchase-order/purchase-order-line';
import { StoreCatalog } from '../../store-catalog/store-catalog';
import { GoodsReceipt } from '../goods-receipt';
import { GoodsReceiptLine } from '../goods-receipt-line';
import { GoodsReceiptLineService } from '../goods-receipt-line.service';
import { GoodsReceiptService } from '../goods-receipt.service';

@Component({
  selector: 'app-goods-receipt-form',
  templateUrl: './goods-receipt-form.component.html',
  styleUrls: ['./goods-receipt-form.component.scss'],
})
export class GoodsReceiptFormComponent implements OnInit {
  form!: FormGroup;

  goodsReceipts: GoodsReceipt[] = [];
  goodsReceipt: GoodsReceipt = {};
  orders: PurchaseOrder[] = [];

  id: string | null = '';
  goodsReceiptLines: GoodsReceiptLine[] = [];
  goodsReceiptLine: GoodsReceiptLine = {};
  newRecord: boolean = false;

  storeCatalogs: StoreCatalog[] = [];
  store: any;
  poLines: PurchaseOrderLine[] = [];
  readOnly: boolean = false;
  home!: MenuItem;
  items: MenuItem[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private goodsReceiptService: GoodsReceiptService,
    private goodsReceiptLineService: GoodsReceiptLineService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: ' Goods Receipts',
        icon: 'pi pi-chevron-left',
        routerLink: '/store/goods-receipt',
      },
    ];
    this.initForm();
    this.id = this.route.snapshot.paramMap.get('id');
  }
  initForm() {
    this.form = this.fb.group({
      id: '',
      purchaseOrder: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        }),
      }),
      store: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        }),
      }),
      documentno: [''],
      receivedDate: [new Date()],
      status: ['DRAFT'],
    });
    this.authService.getUser().then((user: any) => {
      this.goodsReceiptService.getStore(user.id).then((store: any) => {
        this.store = store;
        this.form.controls['store'].patchValue(store);
        this.goodsReceiptService
          .getOrders(store.id, 'SHIPPED,GRPROCESS')
          .then((orders) => {
            this.orders = orders;
          });
        if (this.id) {
          this.getGoodsReceipt();
        }
      });
    });
  }

  saveGoodsReceipt() {
    if (!this.id) {
      this.goodsReceiptService
        .createGoodsReceipt(this.form.value)
        .then((res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Goods Receipt Created',
          });
          this.router.navigate(['/store/goods-receipt/edit/' + res.id]);
        });
    } else {
      this.goodsReceiptService
        .updateGoodsReceipt(this.form.value)
        .then((res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Goods Receipt Updated',
          });
          this.getGoodsReceipt();
        });
    }
  }

  getLines(goodsReceipt: GoodsReceipt) {
    this.goodsReceiptLineService
      .getByGoodsReceipt(goodsReceipt.id!)
      .then((data: any) => {
        this.goodsReceiptLines = data;
      });
  }

  getGoodsReceipt() {
    this.goodsReceiptService.getGoodsReceipt(this.id!).then((res: any) => {
      this.readOnly = res.status != 'DRAFT';
      this.goodsReceipt = res;
      res.receivedDate = new Date(res.receivedDate);
      this.form.patchValue({ ...res });
      this.getGoodsReceiptLines(res.id);
      if (res.purchaseOrder) {
        this.getPurchaseOrderLines(res.purchaseOrder.id);
      }
      this.goodsReceiptLineService
        .getStoreCatalogByStore(this.store.id)
        .then((data: any) => {
          this.storeCatalogs = data;
        });
    });
  }
  getPurchaseOrderLines(orderId: string) {
    this.goodsReceiptLineService.getPoLines(orderId).then((data: any) => {
      this.poLines = data;
      var stcs: any[] = [];
      this.poLines.forEach((line: any) => {
        var stc = this.storeCatalogs.find(
          (t: any) => t.product.id === line.product.id
        );
        if (stc) {
          stcs.push(stc);
        }
      });
      this.storeCatalogs = stcs;
    });
  }
  getGoodsReceiptLines(poId: string) {
    this.goodsReceiptLineService.getByGoodsReceipt(poId).then((data: any) => {
      this.goodsReceiptLines = data;
    });
  }

  onRowEditInit(goodsReceiptLine: GoodsReceiptLine) {
    this.newRecord = false;
  }
  onRowEditSave(goodsReceiptLine: GoodsReceiptLine) {
    this.newRecord = false;
    var _goodsReceiptLine = goodsReceiptLine;
    _goodsReceiptLine.goodsReceipt = { id: this.id! };
    if (_goodsReceiptLine.id) {
      this.goodsReceiptLineService
        .updateGoodsReceiptLine(_goodsReceiptLine)
        .then((line: any) => {
          _goodsReceiptLine = line;
          this.getGoodsReceipt();
        });
    } else {
      this.goodsReceiptLineService
        .createGoodsReceiptLine(_goodsReceiptLine)
        .then((line: any) => {
          _goodsReceiptLine = line;
          this.getGoodsReceipt();
        });
    }
  }
  onRowEditCancel(goodsReceiptLine: any, index: any) {
    if (!goodsReceiptLine.id) {
      this.goodsReceiptLines.splice(index, 1);
    }
    this.newRecord = false;
  }

  newRow(): any {
    return { storeCatalog: {}, orderedQty: 1 };
  }
  delete(goodsReceiptLine: any) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' +
        goodsReceiptLine.storeCatalog.product.name +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goodsReceiptLineService
          .deleteGoodsReceiptLine(goodsReceiptLine.id)
          .then((data) => {
            this.goodsReceiptLines = this.goodsReceiptLines.filter(
              (val) => val.id !== goodsReceiptLine.id
            );
            // this.customer = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Goods Receipt Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Goods Receipt Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  setLineValues(goodsReceiptLine: GoodsReceiptLine) {
    if (
      goodsReceiptLine.storeCatalog &&
      goodsReceiptLine.storeCatalog.product
    ) {
      var _pol = this.poLines.find(
        (t) => t.product.id === goodsReceiptLine.storeCatalog!.product!.id
      );
      goodsReceiptLine.purchaseOrderLine = _pol;
      goodsReceiptLine.orderedQty = _pol?.orderedQuantity;
      goodsReceiptLine.confirmedQty = _pol?.confirmedQuantity;
      goodsReceiptLine.shippedQty = _pol?.shippedQuantity;
      goodsReceiptLine.receivedQty = _pol?.receivedQuantity;
    }
  }

  setLineQtyValues($event: any, grLine: GoodsReceiptLine) {}

  processGoodsReceipt() {
    this.goodsReceiptService.processGoodsReceipt(this.id).then((data: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Goods Receipt Processed, Stock Added.',
        life: 3000,
      });
      this.router.navigate(['/store/goods-receipt']);
    });
  }
}

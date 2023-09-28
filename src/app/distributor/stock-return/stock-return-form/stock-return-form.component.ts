import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { GoodsReturn } from 'src/app/store/goods-return/goods-return';
import { GoodsReturnLine } from 'src/app/store/goods-return/goods-return-line';
import { GoodsReturnLineService } from 'src/app/store/goods-return/goods-return-line.service';
import { GoodsReturnService } from 'src/app/store/goods-return/goods-return.service';
import { PurchaseOrder } from 'src/app/store/purchase-order/purchase-order';
import { PurchaseOrderLine } from 'src/app/store/purchase-order/purchase-order-line';
import { StoreCatalog } from 'src/app/store/store-catalog/store-catalog';

@Component({
  selector: 'app-stock-return-form',
  templateUrl: './stock-return-form.component.html',
  styleUrls: ['./stock-return-form.component.scss']
})
export class StockReturnFormComponent implements OnInit {

  form!: FormGroup;

  goodsReturns: GoodsReturn[] = [];
  goodsReturn: GoodsReturn = {};
  orders: PurchaseOrder[] = [];

  id: string | null = '';
  goodsReturnLines: GoodsReturnLine[] = [];
  goodsReturnLine: GoodsReturnLine = {};
  newRecord: boolean = false;

  distributorCatalogs: StoreCatalog[] = [];
  distributor: any;
  poLines: PurchaseOrderLine[] = [];
  readOnly: boolean = false;
  home!: MenuItem;
  items: MenuItem[] = [];
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private goodsReturnService: GoodsReturnService,
    private goodsReturnLineService: GoodsReturnLineService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.id = this.route.snapshot.paramMap.get('id');
    this.items = [
      {
        label: 'Manage Stock Return',
        icon: 'pi pi-fw pi-chevron-left',
        routerLink: ['/distributor/stock-return'],
      }
    ];
  }
  initForm() {
    this.form = this.fb.group({
      id: '',
      purchaseOrder: this.fb.group({ id: this.fb.nonNullable.control('', { validators: Validators.required }) }),
      distributor: this.fb.group({ id: this.fb.nonNullable.control('', { validators: Validators.required }) }),
      documentno: [''],
      returnDate: [new Date()],
      status: ['FORWARDED']
    });
    this.authService.getUser().then((user: any) => {
      this.goodsReturnService.getDistributor(user.id).then((distributor: any) => {
        this.distributor = distributor;
        this.form.controls['distributor'].patchValue(distributor);
        if (this.id) {
          this.getGoodsReturn();
        }
      })
    });

  }

  saveGoodsReturn() {
    if (!this.id) {
      this.goodsReturnService.createGoodsReturn(this.form.value).then((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goods Return Created' });
        this.router.navigate(['/distributor/goods-return/edit/' + res.id]);
      })
    } else {
      this.goodsReturnService.updateGoodsReturn(this.form.value).then((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goods Return Updated' });
        this.getGoodsReturn();
      })
    }
  }

  getLines(goodsReturn: GoodsReturn) {
    this.goodsReturnLineService.getByGoodsReturn(goodsReturn.id!).then((data: any) => {
      this.goodsReturnLines = data;
    })
  }

  getGoodsReturn() {
    this.goodsReturnService.getGoodsReturn(this.id!).then((res: any) => {
      this.readOnly = (res.status != "FORWARDED");
      this.goodsReturn = res;
      res.returnDate = new Date(res.returnDate);
      this.form.patchValue({ ...res });
      this.getGoodsReturnLines(res.id);
      if (res.purchaseOrder) {
        this.getPurchaseOrderLines(res.purchaseOrder.id);
      }
      this.goodsReturnLineService.getDistributorCatalogByDistributor(this.distributor.id).then((data: any) => {
        this.distributorCatalogs = data;
      });
    })
  }
  getPurchaseOrderLines(orderId: string) {
    this.goodsReturnLineService.getPoLines(orderId).then((data: any) => {
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
  getGoodsReturnLines(poId: string) {
    this.goodsReturnLineService.getByGoodsReturn(poId).then((data: any) => {
      this.goodsReturnLines = data;
    });
  }

  onRowEditInit(goodsReturnLine: GoodsReturnLine) {
    this.newRecord = false;
  }
  onRowEditSave(goodsReturnLine: GoodsReturnLine) {
    this.newRecord = false;
    var _goodsReturnLine = goodsReturnLine;
    _goodsReturnLine.goodsReturn = { id: this.id! };
    _goodsReturnLine.acceptedQty = _goodsReturnLine.returnedQty;
    if (_goodsReturnLine.id) {
      this.goodsReturnLineService.updateGoodsReturnLine(_goodsReturnLine).then((line: any) => {
        _goodsReturnLine = line;
        this.getGoodsReturn();
      });
    } else {
      this.goodsReturnLineService.createGoodsReturnLine(_goodsReturnLine).then((line: any) => {
        _goodsReturnLine = line;
        this.getGoodsReturn();
      });
    }
  }
  onRowEditCancel(goodsReturnLine: any, index: any) {
    if (!goodsReturnLine.id) {
      this.goodsReturnLines.splice(index, 1);
    }
    this.newRecord = false;
  }

  newRow(): any {
    return { storeCatalog: {}, orderedQty: 1 };
  }
  delete(goodsReturnLine: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + goodsReturnLine.storeCatalog.product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goodsReturnLineService.deleteGoodsReturnLine(goodsReturnLine.id).then((data) => {
          this.goodsReturnLines = this.goodsReturnLines.filter(val => val.id !== goodsReturnLine.id);
          // this.customer = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Goods Return Deleted', life: 3000 });
        }).catch(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Goods Return Error, Please refresh and try again', life: 3000 });
        });
      }
    });
  }

  setLineValues(goodsReturnLine: GoodsReturnLine) {
    if (goodsReturnLine.storeCatalog && goodsReturnLine.storeCatalog.product) {
      var _pol = this.poLines.find(t => t.product.id === goodsReturnLine.storeCatalog!.product!.id);
      goodsReturnLine.purchaseOrderLine = _pol;
      goodsReturnLine.receivedQty = _pol?.receivedQuantity;
      goodsReturnLine.returnedQty = _pol?.receivedQuantity;
      goodsReturnLine.acceptedQty = _pol?.receivedQuantity;
      goodsReturnLine.unitprice = _pol?.unitprice;
    }
  }

  setLineQtyValues($event: any, grLine: GoodsReturnLine) {

  }

  processGoodsReturn() {
    this.goodsReturnService.processDistributorGoodsReturn(this.id).then((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Goods Return Processed, Stock Added.', life: 3000 });
      this.router.navigate(['/distributor/stock-return']);
    })
  }

}

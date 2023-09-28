import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreUserComponent } from './store-user/store-user.component';
import { DutchModule } from '../dutch/dutch.module';
import { StoreCatalogComponent } from './store-catalog/store-catalog.component';
import { StoreCatalogFormComponent } from './store-catalog/store-catalog-form/store-catalog-form.component';
import { InventoryComponent } from './inventory/inventory.component';
import { StorageComponent } from './stock/storage.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { PosmachineComponent } from './posmachine/posmachine.component';
import { ProductDiscountComponent } from './store-catalog/product-discount/product-discount.component';
import { DiscountComponent } from './discount/discount.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderFormComponent } from './purchase-order/purchase-order-form/purchase-order-form.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { GoodsReceiptFormComponent } from './goods-receipt/goods-receipt-form/goods-receipt-form.component';
import { StockTransactionsComponent } from './stock-transactions/stock-transactions.component';
import { ReturnRefundComponent } from './return-refund/return-refund.component';
import { GoodsReturnFormComponent } from './goods-return/goods-return-form/goods-return-form.component';
import { GoodsReturnComponent } from './goods-return/goods-return.component';
import { StoreCustomersComponent } from './store-customers/store-customers.component';
import { GstReportsComponent } from './gst-reports/gst-reports.component';
import { StoreTableComponent } from './store-table/store-table.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { DeliveryPartnersComponent } from './delivery-partners/delivery-partners.component';

@NgModule({
  declarations: [
    StoreUserComponent,
    StoreCatalogComponent,
    StoreCatalogFormComponent,
    StorageComponent,
    InventoryComponent,
    SalesOrderComponent,
    PosmachineComponent,
    ProductDiscountComponent,
    DiscountComponent,
    PurchaseOrderComponent,
    PurchaseOrderFormComponent,
    GoodsReceiptComponent,
    GoodsReceiptFormComponent,
    StockTransactionsComponent,
    ReturnRefundComponent,
    GoodsReturnFormComponent,
    GoodsReturnComponent,
    StoreCustomersComponent,
    GstReportsComponent,
    StoreTableComponent,
    CustomerOrderComponent,
    DeliveryPartnersComponent,
  ],
  imports: [CommonModule, StoreRoutingModule, DutchModule],
})
export class StoreModule {}

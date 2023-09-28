import { StoreCustomersComponent } from './store-customers/store-customers.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { LayoutComponent } from '../dutch/layout/layout.component';
import { StoresComponent } from '../masters/stores/stores.component';
import { DiscountComponent } from './discount/discount.component';
import { GoodsReceiptFormComponent } from './goods-receipt/goods-receipt-form/goods-receipt-form.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { GoodsReturnFormComponent } from './goods-return/goods-return-form/goods-return-form.component';
import { GoodsReturnComponent } from './goods-return/goods-return.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PosmachineComponent } from './posmachine/posmachine.component';
import { PurchaseOrderFormComponent } from './purchase-order/purchase-order-form/purchase-order-form.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ReturnRefundComponent } from './return-refund/return-refund.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { StockTransactionsComponent } from './stock-transactions/stock-transactions.component';
import { StorageComponent } from './stock/storage.component';
import { StoreCatalogFormComponent } from './store-catalog/store-catalog-form/store-catalog-form.component';
import { StoreCatalogComponent } from './store-catalog/store-catalog.component';
import { StoreUserComponent } from './store-user/store-user.component';
import { GstReportsComponent } from './gst-reports/gst-reports.component';
import { StoreTableComponent } from './store-table/store-table.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { DeliveryPartnersComponent } from './delivery-partners/delivery-partners.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'gst-report',
        component: GstReportsComponent,
      },
      {
        path: 'customer-order',
        component: CustomerOrderComponent,
      },
      {
        path: 'delivery-partner',
        component: DeliveryPartnersComponent,
      },
      {
        path: 'my-stores',
        component: StoresComponent,
      },
      {
        path: 'users',
        component: StoreUserComponent,
      },
      {
        path: 'customers',
        component: StoreCustomersComponent,
      },
      {
        path: 'discounts',
        component: DiscountComponent,
      },
      {
        path: 'posmachines',
        component: PosmachineComponent,
      },
      {
        path: 'stock',
        component: StorageComponent,
      },
      {
        path: 'inventory',
        component: InventoryComponent,
      },
      {
        path: 'orders',
        component: SalesOrderComponent,
      },
      {
        path: 'stock-transactions',
        component: StockTransactionsComponent,
      },
      {
        path: 'return-refund',
        component: ReturnRefundComponent,
      },
      {
        path: 'storecatalog',
        component: DispatcherComponent,
        children: [
          { path: '', component: StoreCatalogComponent },
          { path: 'create', component: StoreCatalogFormComponent },
          { path: 'edit/:id', component: StoreCatalogFormComponent },
        ],
      },
      {
        path: 'purchase-orders',
        component: DispatcherComponent,
        children: [
          { path: '', component: PurchaseOrderComponent },
          { path: 'create', component: PurchaseOrderFormComponent },
          { path: 'edit/:id', component: PurchaseOrderFormComponent },
        ],
      },
      {
        path: 'goods-receipt',
        component: DispatcherComponent,
        children: [
          { path: '', component: GoodsReceiptComponent },
          { path: 'create', component: GoodsReceiptFormComponent },
          { path: 'edit/:id', component: GoodsReceiptFormComponent },
        ],
      },
      {
        path: 'goods-return',
        component: DispatcherComponent,
        children: [
          { path: '', component: GoodsReturnComponent },
          { path: 'create', component: GoodsReturnFormComponent },
          { path: 'edit/:id', component: GoodsReturnFormComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}

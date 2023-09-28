import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributorRoutingModule } from './distributor-routing.module';
import { DutchModule } from '../dutch/dutch.module';
import { DistributorUserComponent } from './distributor-user/distributor-user.component';
import { WhInventoryComponent } from './wh-inventory/wh-inventory.component';
import { DistributorCatalogComponent } from './distributor-catalog/distributor-catalog.component';
import { WhStorageComponent } from './wh-storage/wh-storage.component';
import { DistributorCatalogFormComponent } from './distributor-catalog/distributor-catalog-form/distributor-catalog-form.component';
import { StoreStockComponent } from './store-stock/store-stock.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { SalesRequestComponent } from './sales-request/sales-request.component';
import { SalesRequestFormComponent } from './sales-request/sales-request-form/sales-request-form.component';
import { DistributorOrdersComponent } from './sales-orders/distributor-orders.component';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { GoodsShipmentComponent } from './goods-shipment/goods-shipment.component';
import { GoodsShipmentFormComponent } from './goods-shipment/goods-shipment-form/goods-shipment-form.component';
import { StockReturnFormComponent } from './stock-return/stock-return-form/stock-return-form.component';
import { StockReturnComponent } from './stock-return/stock-return.component';
import { SalesInvoiceFormComponent } from './sales-invoices/sales-invoice-form/sales-invoice-form.component';

@NgModule({
  declarations: [
    DistributorUserComponent,
    WhInventoryComponent,
    DistributorCatalogComponent,
    WhStorageComponent,
    DistributorCatalogFormComponent,
    StoreStockComponent,
    WarehousesComponent,
    SalesRequestComponent,
    SalesRequestFormComponent,
    DistributorOrdersComponent,
    SalesInvoicesComponent,
    GoodsShipmentComponent,
    GoodsShipmentFormComponent,
    StockReturnFormComponent,
    StockReturnComponent,
    SalesInvoiceFormComponent,
  ],
  imports: [CommonModule, DistributorRoutingModule, DutchModule],
})
export class DistributorModule {}

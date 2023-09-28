import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { LayoutComponent } from '../dutch/layout/layout.component';
import { DistributorCatalogComponent } from './distributor-catalog/distributor-catalog.component';
import { DistributorUserComponent } from './distributor-user/distributor-user.component';
import { DistributorCatalogFormComponent } from './distributor-catalog/distributor-catalog-form/distributor-catalog-form.component';
import { WhInventoryComponent } from './wh-inventory/wh-inventory.component';
import { WhStorageComponent } from './wh-storage/wh-storage.component';
import { StoreStockComponent } from './store-stock/store-stock.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { SalesRequestComponent } from './sales-request/sales-request.component';
import { SalesRequestFormComponent } from './sales-request/sales-request-form/sales-request-form.component';
import { DistributorsComponent } from '../masters/distributors/distributors.component';
import { DistributorOrdersComponent } from './sales-orders/distributor-orders.component';
import { GoodsShipmentComponent } from './goods-shipment/goods-shipment.component';
import { GoodsShipmentFormComponent } from './goods-shipment/goods-shipment-form/goods-shipment-form.component';
import { StockReturnComponent } from './stock-return/stock-return.component';
import { StockReturnFormComponent } from './stock-return/stock-return-form/stock-return-form.component';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { GstReportsComponent } from '../store/gst-reports/gst-reports.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'my-distributors',
        component: DistributorsComponent,
      },
      {
        path: 'users',
        component: DistributorUserComponent,
      },
      {
        path: 'warehouses',
        component: WarehousesComponent,
      },
      {
        path: 'stock',
        component: WhStorageComponent,
      },
      {
        path: 'store-stock',
        component: StoreStockComponent,
      },
      {
        path: 'inventory',
        component: WhInventoryComponent,
      },
      {
        path: 'gst-report',
        component: GstReportsComponent,
      },
      {
        path: 'sales-requests',
        component: DispatcherComponent,
        children: [
          { path: '', component: SalesRequestComponent },
          { path: 'edit/:id', component: SalesRequestFormComponent },
        ],
      },
      {
        path: 'sales-orders',
        component: DistributorOrdersComponent,
      },
      {
        path: 'goods-shipment',
        component: DispatcherComponent,
        children: [
          { path: '', component: GoodsShipmentComponent },
          { path: 'create', component: GoodsShipmentFormComponent },
          { path: 'edit/:id', component: GoodsShipmentFormComponent },
        ],
      },
      {
        path: 'sales-invoices',
        component: SalesInvoicesComponent,
      },
      {
        path: 'stock-return',
        component: DispatcherComponent,
        children: [
          { path: '', component: StockReturnComponent },
          { path: 'create', component: StockReturnFormComponent },
          { path: 'edit/:id', component: StockReturnFormComponent },
        ],
      },
      {
        path: 'distributorcatalog',
        component: DispatcherComponent,
        children: [
          { path: '', component: DistributorCatalogComponent },
          { path: 'create', component: DistributorCatalogFormComponent },
          { path: 'edit/:id', component: DistributorCatalogFormComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ReceiptNoteComponent } from './receipt-note/receipt-note.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { PoDashboardComponent } from './po-dashboard/po-dashboard.component';
import { DebitNoteDashboardComponent } from './debit-note-dashboard/debit-note-dashboard.component';
import { ReceiptNoteDashboardComponent } from './receipt-note-dashboard/receipt-note-dashboard.component';
import { LayoutComponent } from '../shared/layout/layout.component';
import { GoodsShipmentComponent } from './goods-shipment/goods-shipment.component';
import { GoodsShipmentDashboardComponent } from './goods-shipment-dashboard/goods-shipment-dashboard.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { GoodsReceiptDashboardComponent } from './goods-receipt-dashboard/goods-receipt-dashboard.component';


const routes: Routes = [
  {
    path: 'purchaseOrder',
    component:LayoutComponent ,
    children: [
      { path: '', component: PurchaseOrderComponent },
      { path: 'create', component: PurchaseOrderComponent },
      { path: 'edit/:id', component: PurchaseOrderComponent },
    ],
  },
  {
    path: 'receiptNote',
    component:LayoutComponent ,
    children: [
      { path: '', component: ReceiptNoteComponent },
      { path: 'create', component: ReceiptNoteComponent },
      { path: 'edit/:id', component: ReceiptNoteComponent },
    ],
  },
  {
    path: 'debitNote',
    component:LayoutComponent ,
    children: [
      { path: '', component: DebitNoteComponent },
      { path: 'create', component: DebitNoteComponent },
      { path: 'edit/:id', component: DebitNoteComponent },
    ],
  },
  {
    path: 'purchaseOrders',
    component:LayoutComponent,
    children: [
      { path: '', component: PoDashboardComponent },
    ],
  },
  {
    path: 'debitNotes',
    component:LayoutComponent,
    children: [
      { path: '', component: DebitNoteDashboardComponent },
    ]
  },
  {
    path: 'receiptNotes',
    component:LayoutComponent,
    children: [
      { path: '', component: ReceiptNoteDashboardComponent },
    ]
  },
  {
    path: 'goodsShipment',
    component:LayoutComponent ,
    children: [
      { path: '', component: GoodsShipmentComponent },
      { path: 'create', component: GoodsShipmentComponent },
      { path: 'edit/:id', component: GoodsShipmentComponent },
    ],
  },
  {
    path: 'goodsShipments',
    component:LayoutComponent ,
    children: [
      { path: '', component: GoodsShipmentDashboardComponent }
    ],
  },
  {
    path: 'goodsReceipt',
    component:LayoutComponent ,
    children: [
      { path: '', component: GoodsReceiptComponent },
      { path: 'create', component: GoodsReceiptComponent },
      { path: 'edit/:id', component: GoodsReceiptComponent },
    ],
  },
  {
    path: 'goodsReceipts',
    component:LayoutComponent ,
    children: [
      { path: '', component: GoodsReceiptDashboardComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ReceiptNoteComponent } from './receipt-note/receipt-note.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { PoDashboardComponent } from './po-dashboard/po-dashboard.component';
import { DebitNoteDashboardComponent } from './debit-note-dashboard/debit-note-dashboard.component';
import { ReceiptNoteDashboardComponent } from './receipt-note-dashboard/receipt-note-dashboard.component';
import { LayoutComponent } from '../shared/layout/layout.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule { }

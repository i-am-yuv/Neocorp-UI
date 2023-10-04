import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { CashMemoComponent } from './cash-memo/cash-memo.component';
import { CreditNoteDashboardComponent } from './credit-note-dashboard/credit-note-dashboard.component';
import { SalesOrderDashboardComponent } from './sales-order-dashboard/sales-order-dashboard.component';
import { CashMemoDashboardComponent } from './cash-memo-dashboard/cash-memo-dashboard.component';
import { VendorInvoiceComponent } from './vendor-invoice/vendor-invoice.component';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';
import { SalesInvoiceDashboardComponent } from './sales-invoice-dashboard/sales-invoice-dashboard.component';
import { VendorInvoiceDashboardComponent } from './vendor-invoice-dashboard/vendor-invoice-dashboard.component';
import { LayoutComponent } from '../shared/layout/layout.component';

const routes: Routes = [
  {
    path: 'salesOrder',
    component:LayoutComponent ,
    children: [
      { path: '', component: SalesOrderComponent },
      { path: 'create', component: SalesOrderComponent },
      { path: 'edit/:id', component: SalesOrderComponent },
    ],
  },
  {
    path: 'vendorInvoice',
    component:LayoutComponent ,
    children: [
      { path: '', component: VendorInvoiceComponent },
      { path: 'create', component: VendorInvoiceComponent },
      { path: 'edit/:id', component: VendorInvoiceComponent },
    ],
  },
  {
    path: 'salesInvoice',
    component:LayoutComponent ,
    children: [
      { path: '', component: SalesInvoiceComponent },
      { path: 'create', component: SalesInvoiceComponent },
      { path: 'edit/:id', component: SalesInvoiceComponent },
    ],
  },
  {
    path: 'creditNote',
    component:LayoutComponent ,
    children: [
      { path: '', component: CreditNoteComponent },
      { path: 'create', component: CreditNoteComponent },
      { path: 'edit/:id', component: CreditNoteComponent },
    ],
  },
  {
    path: 'cashMemo',
    component:LayoutComponent ,
    children: [
      { path: '', component: CashMemoComponent },
      { path: 'create', component: CashMemoComponent },
      { path: 'edit/:id', component: CashMemoComponent },
    ],
  },
  {
    path: 'creditNotes',
    component:LayoutComponent ,
    children: [
      { path: '', component: CreditNoteDashboardComponent }
    ]
  },
  {
    path: 'salesOrders',
    component:LayoutComponent ,
    children: [
      { path: '', component: SalesOrderDashboardComponent }
    ]
  },
  {
    path: 'cashMemos',
    component:LayoutComponent ,
    children: [
      { path: '', component: CashMemoDashboardComponent }
    ]
    
  },
  {
    path: 'salesInvoices',
    component:LayoutComponent ,
    children: [
      { path: '', component: SalesInvoiceDashboardComponent }
    ]
  },
  {
    path: 'vendorInvoices',
    component:LayoutComponent ,
    children: [
      { path: '', component: VendorInvoiceDashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }

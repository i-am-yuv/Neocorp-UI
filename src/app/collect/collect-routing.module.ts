import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { PoInvoiceComponent } from './po-invoice/po-invoice.component';
import { CustomerComponent } from './customer/customer.component';
import { PoInvoiceDashboardComponent } from './po-invoice-dashboard/po-invoice-dashboard.component';

const routes: Routes = [
  {
    path: 'purchaseInvoice',
    component:DispatcherComponent ,
    children: [
      { path: '', component: PoInvoiceComponent  },
      { path: 'create', component: PoInvoiceComponent  },
      { path: 'edit/:id', component: PoInvoiceComponent }
    ]
  },
  {
    path: 'purchaseInvoices',
    component:PoInvoiceDashboardComponent
  },
  {
    path: 'createCustomer',
    component:CustomerComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectRoutingModule { }

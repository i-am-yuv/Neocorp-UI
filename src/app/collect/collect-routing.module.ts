import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { PoInvoiceComponent } from './po-invoice/po-invoice.component';
import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
  {
    path: 'purchaseInvoice',
    component:DispatcherComponent ,
    children: [
      { path: 'create', component: PoInvoiceComponent  },
      { path: 'edit/:id', component: PoInvoiceComponent }
    ]
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

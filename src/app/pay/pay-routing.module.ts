import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor/vendor.component';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { ReturnRefundComponent } from './return-refund/return-refund.component';
import { ReturnRefundDashboardComponent } from './return-refund-dashboard/return-refund-dashboard.component';
import { LayoutComponent } from '../shared/layout/layout.component';

const routes: Routes = [
  {
    path: 'vendor',
    component: LayoutComponent,
    children: [
      { path: '', component: VendorComponent }
    ],
  },
  {
    path: 'returnAndRefund',
    component:LayoutComponent ,
    children: [
      { path: '', component: ReturnRefundComponent },
      { path: 'create', component: ReturnRefundComponent },
      { path: 'edit/:id', component: ReturnRefundComponent },
    ],
  },
  {
    path: 'returnAndRefunds',
    component:LayoutComponent ,
    children: [
      { path: '', component: ReturnRefundDashboardComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayRoutingModule { }

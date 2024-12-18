import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor/vendor.component';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { ReturnRefundComponent } from './return-refund/return-refund.component';
import { ReturnRefundDashboardComponent } from './return-refund-dashboard/return-refund-dashboard.component';
import { LayoutComponent } from '../shared/layout/layout.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';


const routes: Routes = [
  {
    path: 'vendor',
    component: LayoutComponent,
    children: [
      { path: '', component: VendorComponent },
      { path: 'create', component: VendorComponent },
      { path: 'edit/:id', component: VendorComponent }
    ],
  },
  {
    path: 'vendors',
    component: LayoutComponent,
    children: [
      { path: '', component: VendorDashboardComponent }
    ]
  },
  {
    path: 'returnAndRefund',
    component: LayoutComponent,
    children: [
      { path: '', component: ReturnRefundComponent },
      { path: 'create', component: ReturnRefundComponent },
      { path: 'edit/:id', component: ReturnRefundComponent },
    ],
  },
  {
    path: 'returnAndRefunds',
    component: LayoutComponent,
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

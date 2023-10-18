import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../shared/layout/layout.component';
import { PayToVendorComponent } from './pay-to-vendor/pay-to-vendor.component';

const routes: Routes = [
  {
    path: 'payToVendor',
    component: LayoutComponent,
    children: [
      { path: '', component: PayToVendorComponent },
      { path: 'amount/:amount', component: PayToVendorComponent },
      { path: 'pi/:id', component: PayToVendorComponent },
      { path: 'pi/:id/amount/:amount', component: PayToVendorComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankingRoutingModule { }

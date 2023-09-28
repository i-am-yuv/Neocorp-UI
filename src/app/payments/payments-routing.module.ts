import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { LayoutComponent } from '../dutch/layout/layout.component';
import { BillsComponent } from './bills/bills.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { FundTransferFormComponent } from './fund-transfer/fund-transfer-form/fund-transfer-form.component';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';
import { QuickPayFormComponent } from './quick-pay/quick-pay-form/quick-pay-form.component';
import { QuickPayComponent } from './quick-pay/quick-pay.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: 'fund-transfer',
      component: DispatcherComponent,
      children: [
        {
          path: '',
          component: FundTransferComponent
        },
        {
          path: 'create',
          component: FundTransferFormComponent
        },
        {
          path: 'edit/:id',
          component: FundTransferFormComponent
        }
      ]

    },
    {
      path: 'insta-pay',
      component: DispatcherComponent,
      children: [
        {
          path: '',
          component: QuickPayComponent
        },
        {
          path: 'create',
          component: QuickPayFormComponent
        },
        {
          path: 'edit/:id',
          component: QuickPayFormComponent
        }
      ]
    },
    {
      path: 'scheduled-payments',
      component: ScheduleComponent
    },
    {
      path: 'bill-payments',
      component: BillsComponent
    },
    {
      path: 'bulk-payments',
      component: BulkUploadComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }

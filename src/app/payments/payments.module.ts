import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';
import { QuickPayComponent } from './quick-pay/quick-pay.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { BillsComponent } from './bills/bills.component';
import { DutchModule } from '../dutch/dutch.module';
import { FundTransferFormComponent } from './fund-transfer/fund-transfer-form/fund-transfer-form.component';
import { QuickPayFormComponent } from './quick-pay/quick-pay-form/quick-pay-form.component';


@NgModule({
  declarations: [
    BeneficiariesComponent,
    FundTransferComponent,
    FundTransferFormComponent,
    QuickPayComponent,
    QuickPayFormComponent,
    BulkUploadComponent,
    ScheduleComponent,
    BillsComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    DutchModule
  ]
})
export class PaymentsModule { }

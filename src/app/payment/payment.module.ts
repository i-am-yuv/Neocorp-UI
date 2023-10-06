import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MakePaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule
  ]
})
export class PaymentModule { }

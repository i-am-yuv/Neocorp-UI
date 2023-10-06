import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../shared/layout/layout.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';

const routes: Routes = [
  {
    path: 'makePayment',
    component:LayoutComponent ,
    children: [
      { path: '', component: MakePaymentComponent },
      { path: 'pi/:id', component: MakePaymentComponent  },
      { path: 'si/:id', component: MakePaymentComponent  }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { StoreModule } from './store/store.module';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'invoicing',
    loadChildren: () => import('./invoicing/invoicing.module').then(m => m.InvoicingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'accounting',
    loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'store',
    loadChildren: () => import('./store/store.module').then(m => m.StoreModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'distributor',
    loadChildren: () => import('./distributor/distributor.module').then(m => m.DistributorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'masters',
    loadChildren: () => import('./masters/masters.module').then(m => m.MastersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pay',
    loadChildren: () => import('./pay/pay.module').then(m => m.PayModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bills',
    loadChildren: () => import('./bills/bills.module').then(m => m.BillsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'collect',
    loadChildren: () => import('./collect/collect.module').then(m => m.CollectModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'invoice',
    loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

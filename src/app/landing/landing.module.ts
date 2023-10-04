import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CorpDashboardComponent } from './corp-dashboard/corp-dashboard.component';
import { StoreDashboardComponent } from './store-dashboard/store-dashboard.component';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';
import { DistributorDashboardComponent } from './distributor-dashboard/distributor-dashboard.component';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    CorpDashboardComponent,
    StoreDashboardComponent,
    SuperadminDashboardComponent,
    DistributorDashboardComponent,
    FirstpageComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    // DutchModule,
    SharedModule
  ]
})
export class LandingModule { }

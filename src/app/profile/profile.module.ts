import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '../shared/shared.module';
import { CategoryComponent } from './category/category.component';
import { ProductDashboardComponent } from './product-dashboard/product-dashboard.component';
import { PcDashboardComponent } from './pc-dashboard/pc-dashboard.component';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';



@NgModule({
  declarations: [
    ProductComponent,
    CategoryComponent,
    ProductDashboardComponent,
    PcDashboardComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ToastModule,
    MenubarModule
  ]
})
export class ProfileModule { }

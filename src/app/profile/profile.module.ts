import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '../shared/shared.module';
import { DutchModule } from '../dutch/dutch.module';
import { CategoryComponent } from './category/category.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';



@NgModule({
  declarations: [
    ProductComponent,
    CategoryComponent,
    BeneficiaryComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    DutchModule
  ]
})
export class ProfileModule { }

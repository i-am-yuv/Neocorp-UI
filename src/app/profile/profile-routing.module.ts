import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { LayoutComponent } from '../shared/layout/layout.component';

const routes: Routes = [
  {
    path: 'product',
    component:LayoutComponent ,
    children: [
      { path: '', component: ProductComponent }
    ],
  },
  {
    path: 'productCateogry',
    component:LayoutComponent ,
    children: [
      { path: '', component: CategoryComponent }
    ],
  },
  {
    path: 'beneficiary',
    component:LayoutComponent ,
    children: [
      { path: 'create', component: BeneficiaryComponent },
      { path: 'edit/:id', component: BeneficiaryComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { LayoutComponent } from '../shared/layout/layout.component';
import { ProductDashboardComponent } from './product-dashboard/product-dashboard.component';
import { PcDashboardComponent } from './pc-dashboard/pc-dashboard.component';

const routes: Routes = [
  {
    path: 'product',
    component:LayoutComponent ,
    children: [
      { path: '', component: ProductComponent },
      { path: 'create', component: ProductComponent },
      { path: 'edit/:id', component: ProductComponent}
    ],
  },
  {
    path: 'products',
    component: LayoutComponent,
    children: [
      { path: '', component: ProductDashboardComponent}
    ]
  },
  {
    path: 'productCategory',
    component:LayoutComponent ,
    children: [
      { path: '', component: CategoryComponent },
      { path: 'create', component: CategoryComponent },
      { path: 'edit/:id', component: CategoryComponent }
    ],
  },
  {
    path: 'productCategories',
    component:LayoutComponent ,
    children: [
      { path: '', component: PcDashboardComponent}
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

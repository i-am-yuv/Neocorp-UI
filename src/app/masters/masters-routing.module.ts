import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../dutch/layout/layout.component';
import { BrandsComponent } from './brands/brands.component';
import { CompaniesComponent } from './companies/companies.component';
import { CountriesComponent } from './countries/countries.component';
import { DistributorsComponent } from './distributors/distributors.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from '../settings/settings/settings.component';
import { StatesComponent } from './states/states.component';
import { StoresComponent } from './stores/stores.component';
import { TaxRatesComponent } from './tax-rates/tax-rates.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { BlueLayoutComponent } from '../dutch/blue-layout/blue-layout.component';
import { PartnersComponent } from './partners/partners.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'companies',
        component: CompaniesComponent,
      },
      {
        path: 'product-categories',
        component: ProductCategoriesComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'countries',
        component: CountriesComponent,
      },
      {
        path: 'partners',
        component: PartnersComponent,
      },
      {
        path: 'states',
        component: StatesComponent,
      },
      {
        path: 'brands',
        component: BrandsComponent,
      },
      {
        path: 'tax-rates',
        component: TaxRatesComponent,
      },
      {
        path: 'stores',
        component: StoresComponent,
      },
      {
        path: 'distributors',
        component: DistributorsComponent,
      },
      {
        path: 'warehouses',
        component: WarehousesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}

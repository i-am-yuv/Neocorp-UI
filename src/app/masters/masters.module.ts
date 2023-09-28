import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { DutchModule } from '../dutch/dutch.module';
import { CompaniesComponent } from './companies/companies.component';
import { ProductsComponent } from './products/products.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { StatesComponent } from './states/states.component';
import { CountriesComponent } from './countries/countries.component';
import { BrandsComponent } from './brands/brands.component';
import { StoresComponent } from './stores/stores.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { TaxRatesComponent } from './tax-rates/tax-rates.component';
import { DistributorsComponent } from './distributors/distributors.component';
import { PartnersComponent } from './partners/partners.component';

@NgModule({
  declarations: [
    CompaniesComponent,
    ProductsComponent,
    ProductCategoriesComponent,
    StatesComponent,
    CountriesComponent,
    BrandsComponent,
    StoresComponent,
    WarehousesComponent,
    TaxRatesComponent,
    DistributorsComponent,
    PartnersComponent,
  ],
  imports: [CommonModule, MastersRoutingModule, DutchModule],
})
export class MastersModule {}

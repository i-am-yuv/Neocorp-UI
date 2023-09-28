import { FormControl, FormGroup } from '@angular/forms';
import { Brand, BrandForm } from '../brands/brand';
import {
  ProductCategories,
  ProductCategoriesForm,
} from '../product-categories/product-categories';
import { TaxRate, TaxRateForm } from '../tax-rates/tax-rate';

export interface Product {
  id?: string;
  searchKey: string;
  name: string;
  model?: string;
  description?: string;
  productType?: ProductType;
  skuCode?: string;
  barCode?: string;
  help?: string;
  needapproval?: boolean;
  thumbnail?: string;
  mrp: number;
  category?: ProductCategories;
  hsnCode?: string;
  brand?: Brand;
  taxRate?: TaxRate;
}

export enum ProductType {
  ITEM = 'ITEM',
  SERVICE = 'SERVICE',
}

export interface ProductForm {
  id?: FormControl<string | null>;
  searchKey: FormControl<string>;
  name: FormControl<string>;
  model?: FormControl<string | null>;
  description?: FormControl<string | null>;
  productType: FormControl<ProductType>;
  skuCode?: FormControl<string | null>;
  barCode?: FormControl<string | null>;
  hsnCode?: FormControl<string | null>;
  help?: FormControl<string | null>;
  needapproval?: FormControl<boolean | null>;
  //thumbnail?: FormControl<string | null>;
  mrp: FormControl<number>;
  category: FormGroup<ProductCategoriesForm>;
  brand: FormGroup<BrandForm>;
  taxRate: FormGroup<TaxRateForm>;
}

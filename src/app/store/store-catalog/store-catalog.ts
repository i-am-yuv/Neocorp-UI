import { Brand } from 'src/app/masters/brands/brand';
import { ProductCategories } from 'src/app/masters/product-categories/product-categories';
import { Product, ProductType } from 'src/app/masters/products/product';
import { TaxRate } from 'src/app/masters/tax-rates/tax-rate';

export interface StoreCatalog {
  id?: string;
  product?: Product;
  distributor?: any;
  sellingPrice?: number;
  validTill?: Date;
  landingCost?: number;
  store?: any;
  local?: boolean;
  name?: string;
  description?: string;
  productType?: ProductType;
  skuCode?: string;
  barCode?: string;
  hsnCode?: string;
  thumbnail?: string;
  mrp?: number;
  category?: ProductCategories;
  brand?: Brand;
  taxRate?: TaxRate;
  help?: string;
}
export interface CatalogExcel {
  name?: string;
  hsnCode?: string;
  mrp?: number;
  sellingPrice?: number;
  help?: string;
}

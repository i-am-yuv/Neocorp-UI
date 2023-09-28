import { Product } from 'src/app/masters/products/product';

export interface DistributorCatalog {
  id?: string;
  product?: Product;
  sellingPrice?: number;
  validTill?: Date;
  landingCost?: number;
  distributor?: any;
}

export interface CatalogExcel {
  name?: string;
  mrp?: number;
  sellingPrice?: number;
  landingCost?: number;
}

import { Brand } from "../masters/brands/brand";
import { ProductCategories } from "../masters/product-categories/product-categories";
import { TaxRate } from "../masters/tax-rates/tax-rate";
import { UOM } from "../settings/customers/customer";
import { ProductCategory } from "./product-category";

export interface ProfileModels {
}
export interface Product {
<<<<<<< Updated upstream
    id?: string;
    name?: string;
    model?: string;
    searchKey ?: string;
    description ?: string,
    skuCode?: string,
    barCode?: string,
    thumbnail?: string,
    help ?: string
    hsnCode?: string,
    imageName?: string
    imagePath?: string
    productType ?: string,
    category ?:Product ,
    taxRate ?: TaxRate ,
    brand ?: Brand ,
    uom ?: UOM,
    mrp ?: number 
  }

  enum ProductType {
    Type1 = 'ITEM',
    Type2 = 'SERVICE'
  }

  export interface Beneficiary{
    id ?: string,
    beneficaryName ?: string,
    nickname ?: string,
    accountNumber ?: string,
    ifscCode ?: string,
    mobileNumber ?: number,
    mmid ?: string,
    signupTime ?: any;
    
  }

  export interface State {
    id?: string;
    stateName?: string;
    stateCode?: string;
    country ?: any ;
    isTaxZone ?: boolean ;
    isUT ?: boolean ;
=======
  id?: string;
  name?: string;
  model?: string;
  searchKey?: string;
  description?: string,
  skuCode?: string,
  barCode?: string,
  thumbnail?: string,
  help?: string
  hsnCode?: string,
  imageName?: string
  imagePath?: string
  productType?: string,
  category?: ProductCategories,
  taxRate?: TaxRate,
  brand?: Brand,
  uom?: UOM,
  mrp?: number
}

enum ProductType {
  Type1 = 'ITEM',
  Type2 = 'SERVICE'
}

export interface Beneficiary {
  id?: string,
  beneficaryName?: string,
  nickname?: string,
  accountNumber?: string,
  ifscCode?: string,
  mobileNumber?: number,
  mmid?: string,
  signupTime?: any;
  coolingPeriodEnd?: any;
  inCoolingPeriod?: boolean
}

export interface State {
  id?: string;
  stateName?: string;
  stateCode?: string;
  country?: any;
  isTaxZone?: boolean;
  isUT?: boolean;
>>>>>>> Stashed changes
}

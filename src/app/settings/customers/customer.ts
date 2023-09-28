import { FormControl, FormGroup } from '@angular/forms';
import { Company, CompanyForm } from 'src/app/masters/companies/company';
import { User, UserForm } from '../users/user';
import { Brand } from 'src/app/masters/brands/brand';
import { TaxRate } from 'src/app/masters/tax-rates/tax-rate';
import { ProductCategories } from 'src/app/masters/product-categories/product-categories';

export interface Customer {
  id?: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  GST?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
  contactPersonEmail?: string;
  company?: Company;
  user?: User;
}

export interface CustomeR {
  id?: string;
  displayName?: string;
  contactName?: string;
  mobileNumber?: string;
  email?: string;
  accountDetails?:AccountDetails ;
  address?:Address ;
  notes?: string;
  upiId ?: string;
}

export interface Vendor {
  id?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  email?: string;
  accountDetails?:AccountDetails ;
  address?:Address ;
  notes?: string;
  upiId ?: string;
  username ?: string;
  password ?: string;
}

export interface LineItem{
  id ?: string;
  expenseName ?: Product ;
  unitPrice ?: number ;
  quantity ?: number ;
  amount ?: number;
  discount ?: number;
}

export interface Product {
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
  category ?:ProductCategories ,
  taxRate ?: TaxRate ,
  brand ?: Brand ,
  uom ?: UOM,
  mrp ?: number 
}

export interface UOM{
  id ?: string,
  uomName ?: string,
  uomCode ?: string ,
  uomDescription ?: string
}

export interface AccountDetails{
  id?: string;
  AccountType?: string;
  AccountNumber?: string;
  IFSC?: string;
  bankname?: string;
  branchName?: string;
}

export interface Address{
  id?: string;
  billingName?: string;
  billingAddress?: string;
  pincode?: number;
  city?: string;
  isShippingAddressSameAsBillingAddress?:boolean;
  shippingName?: string;
  shippingAddress?: string;
}

export interface CustomerForm {
  id?: FormControl<string | null>;
  firstName: FormControl<string>;
  lastName: FormControl<string | null>;
  phone: FormControl<string>;
  email: FormControl<string>;
  GST?: FormControl<string>;
  contactPersonName?: FormControl<string>;
  contactPersonPhone?: FormControl<string>;
  contactPersonEmail?: FormControl<string>;
  company?: FormGroup<CompanyForm>;
  user?: FormGroup<UserForm>;
}

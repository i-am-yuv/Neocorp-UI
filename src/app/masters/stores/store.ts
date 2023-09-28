import { FormControl } from '@angular/forms';
import { Company } from '../companies/company';
import { State } from '../states/state';

export interface Store {
  id?: string;
  storeName?: string;
  storeLocation?: string;
  storeAddress1?: string;
  storeAddress2?: string;
  storePhone?: string;
  storeMail?: string;
  state?: State;
  stateId?: string;
  pincode?: string;
  company?: Company;
  logo?: string;
  gstNumber?: string;
}

export interface StoreForm {
  id?: FormControl<string | null>;
  storeName: FormControl<string>;
}

export interface StoreUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  PAN?: string;
  company?: any;
  user?: any;
  store?: any;
}

export interface StoreCusUser1 {
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface StoreCusUser2 {
  email?: string;
  password?: string;
  userName?: string;
  roles?: any;
}

export interface StoreWalkThorugh {
  catalog?: boolean;
  companyStatus?: boolean;
  machine?: boolean;
  paymentMethod?: boolean;
  profileStatus?: boolean;
  storeStatus?: boolean;
}

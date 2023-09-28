export interface DistributorUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    PAN?: string;
    company?: any;
    user?: any;
    distributor?: any;
    companyAdmin?: boolean;
}

export interface DistributorWalkThorugh {
    catalog?: boolean;
    companyStatus?: boolean; 
    paymentMethod?: boolean;
    profileStatus?: boolean; 
  }

//   {
//     "profileStatus": true,
//     "companyStatus": true,
//     "storeStatus": true,
//     "catalog": false,
//     "machine": true,
//     "paymentMethod": false
//   }
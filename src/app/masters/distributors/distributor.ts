import { Company } from 'src/app/masters/companies/company';
import { State } from '../states/state';

export interface Distributor {
  id?: string;
  distributorName?: string;
  distributorLocation?: string;
  distributorAddress1?: string;
  distributorAddress2?: string;
  distributorPhone?: string;
  distributorMail?: string;
  state?: State;
  stateId?: string;
  pincode?: string;
  company?: Company;
  logo?: string;
  gstNumber?: string;
}

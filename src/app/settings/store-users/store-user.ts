import { Company } from "src/app/masters/companies/company";
import { Store } from "src/app/masters/stores/store";
import { User } from "../users/user";

export interface StoreUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    code?: string;
    phone?: string;
    email?: string;
    pan?: string;
    isTaxExempted?: boolean;
    company?: Company;
    user?: User;
    store?: Store;
    companyAdmin?: boolean;
}

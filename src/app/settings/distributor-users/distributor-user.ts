import { Company } from "src/app/masters/companies/company";
import { Distributor } from "src/app/masters/distributors/distributor";
import { User } from "../users/user";

export interface DistributorUser {
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
    distributor?: Distributor;
    companyAdmin?: boolean;
}
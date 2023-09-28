import { Company } from "src/app/masters/companies/company";
import { Distributor } from "src/app/masters/distributors/distributor";
import { State } from "src/app/masters/states/state";


export interface Warehouse {
    id?: string;
    warehouseName?: string;
    warehouseLocation?: string;
    warehouseAddress1?: string;
    warehouseAddress2?: string;
    warehousePhone?: string;
    warehouseMail?: string;
    state?: State;
    company?: Company;
    distributor?: Distributor;
}

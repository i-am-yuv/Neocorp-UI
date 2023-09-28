import { Company } from "../companies/company";
import { Distributor } from "../distributors/distributor";
import { State } from "../states/state";

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

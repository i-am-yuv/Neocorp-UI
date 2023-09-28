import { FormControl } from "@angular/forms";
import { Distributor } from "src/app/masters/distributors/distributor";

export interface GoodsShipment {
    id?: string;
    purchaseOrder?: any;
    documentno?: string;
    distributor?: Distributor;
    shipmentDate?: Date;
    status?: string;
}
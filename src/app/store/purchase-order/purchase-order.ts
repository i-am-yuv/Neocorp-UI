import { Distributor } from "src/app/masters/distributors/distributor";
import { Store } from "src/app/masters/stores/store";
import { Warehouse } from "src/app/masters/warehouses/warehouse";

export interface PurchaseOrder {
    id?: string;
    documentnumber?: string;
    gst?: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    utgst?: number;
    grossDiscount?: number;
    grosstotal?: number;
    status?: string;
    dueDate?: Date;
    store?: Store;
    warehouse?: Warehouse;
    distributor?: Distributor;
    orderDate?: Date;
}

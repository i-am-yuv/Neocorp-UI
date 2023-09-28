import { Store } from "src/app/masters/stores/store";
import { Warehouse } from "src/app/masters/warehouses/warehouse";

export interface GoodsReturn {
    id?: string;
    purchaseOrder?: any;
    documentno?: string;
    store?: Store;
    warehouse?: Warehouse;
    returnDate?: Date;
    status?: string;
}

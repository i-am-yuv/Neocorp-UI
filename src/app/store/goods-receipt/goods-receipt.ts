import { Store } from "src/app/masters/stores/store";

export interface GoodsReceipt {
    id?: string;
    purchaseOrder?: any;
    documentno?: string;
    store?: Store;
    receivedDate?: Date;
    status?: string;
}

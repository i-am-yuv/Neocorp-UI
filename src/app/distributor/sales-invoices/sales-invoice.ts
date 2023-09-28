import { Distributor } from "src/app/masters/distributors/distributor";
import { Store } from "src/app/masters/stores/store";
import { PurchaseOrder } from "src/app/store/purchase-order/purchase-order";

export interface SalesInvoice {
    id?: string;
    invoiceNo?: string;
    invoiceDate?: Date;
    purchaseOrder?: PurchaseOrder;
    store?: Store;
    distributor?: Distributor;
    gst?: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    utgst?: number;
    grossTotal?: number;
    grossDiscount?: number;
    status?: string;
}

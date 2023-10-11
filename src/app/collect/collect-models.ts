import { PurchaseOrder } from "../bills/bills-model";
import { Product } from "../profile/profile-models";
import { CustomeR, Vendor } from "../settings/customers/customer";

export class CollectModels {
}

export class PurchaseInvoice{
    id ?: string;
    invoiceNo ?: string;
    invoiceDate?:Date;
    duedate?:Date;
    vendor?:Vendor;
    // customer?:CustomeR;
    purchaseOrder ?: PurchaseOrder;
    penalty ?: number;
    description ?: string;
    status ?: string;
    grossTotal ?: number ;
    taxableTotal ?: number;
}

export interface PurchaseInvoiceLine{
    id ?: string;
    expenseName ?: Product ;
    unitPrice ?: number ;
    quantity ?: number ;
    Amount ?: number;
    discount ?: number;
    purchaseInvoice ?: PurchaseInvoice;
  }

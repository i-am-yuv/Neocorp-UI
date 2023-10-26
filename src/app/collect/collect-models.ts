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
    purchaseOrder ?: PurchaseOrder;
    penalty ?: number;
    description ?: string;
    status ?: string;
    requestStatus ?: string;
    grossTotal ?: number ;
    taxableTotal ?: number;
    remainingAmount ?: number ;
    enablePartialPayments ?: boolean ;
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

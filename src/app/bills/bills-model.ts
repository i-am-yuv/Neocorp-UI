import { Address, CustomeR, Product, Vendor } from "../settings/customers/customer";

export interface BillsModel {
}
export interface PurchaseOrder {
    id?: string;
    grossTotal?: number;
    status?: string;
    description ?: string;
    orderNumber?:string,
    enablePartialPayments ?: boolean;
    internslNotes ?: string;
    dueDate?: Date;
    orderDate?: Date;
    vendor ?: Vendor;
    customer ?: CustomeR;
    purchaseFrom ?: Address;
}
export interface LineItem{
    id ?: string;
    expenseName ?: Product ;
    unitPrice ?: number ;
    quantity ?: number ;
    Amount ?: number;
    discount ?: number;
    purchaseOrder ?: PurchaseOrder;
  }

  export interface ReceiptNote{
    id ?: string;
    receiptNoteNumber ?: string;
    startDate ?: Date;
    endDate ?: Date;
    customer ?: CustomeR;
    vendor ?: Vendor;
    description ?: string;
    internalNotes ?: string;
    clientNotes ?: string;
    placeOfSupply ?: any;
    grossTotal ?: number;
  }

  export interface rnLineItem{
    id ?: string;
    expenseName ?: Product ;
    unitPrice ?: number ;
    quantity ?: number ;
    Amount ?: number;
    discount ?: number;
    receiptNote?: ReceiptNote;
  }

  export interface dnLineItem{
    id ?: string;
    expenseName ?: Product ;
    unitPrice ?: number ;
    quantity ?: number ;
    Amount ?: number;
    discount ?: number;
    debitNote?: DebitNote;
  }



  export interface DebitNote{
    id ?: string;
    debitNoteNumber ?: string;
    startDate ?: Date ;
    duedate ?: Date ;
    debitNote ?: string;
    internalNotes?: string;
    customer ?: string;
    vendor ?: string;
    placeOfSupply ?: any;
    grossTotal ?: number;
  }

  

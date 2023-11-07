import { branch } from "../auth/auth-model";
import { CompanyNew, SalesOrder } from "../invoice/invoice-model";
import { State } from "../profile/profile-models";
import { Address, CustomeR, Product, Vendor } from "../settings/customers/customer";

export interface BillsModel {
}
export interface PurchaseOrder {
  id?: string;
  grossTotal?: number;
  status?: string;
  requestStatus?: string;
  description?: string;
  orderNumber?: string,
  enablePartialPayments?: boolean;
  internslNotes?: string;
  dueDate?: Date;
  orderDate?: Date;
  vendor?: Vendor;
  customer?: CustomeR;
  placeOfSupply?: State;
  branch?: branch;
  comapny?: CompanyNew;
  user ?: any ;
}
export interface LineItem {
  id?: string;
  expenseName?: Product;
  unitPrice?: number;
  quantity?: number;
  Amount?: number;
  discount?: number;
  purchaseOrder?: PurchaseOrder;
}

export interface ReceiptNote {
  id?: string;
  receiptNoteNumber?: string;
  startDate?: Date;
  endDate?: Date;
  customer?: CustomeR;
  vendor?: Vendor;
  description?: string;
  internalNotes?: string;
  clientNotes?: string;
  placeOfSupply?: any;
  grossTotal?: number;
  status?: string;
  comapny?: CompanyNew;
  user ?: any ;
}

export interface rnLineItem {
  id?: string;
  expenseName?: Product;
  unitPrice?: number;
  quantity?: number;
  Amount?: number;
  discount?: number;
  receiptNote?: ReceiptNote;
}

export interface dnLineItem {
  id?: string;
  expenseName?: Product;
  unitPrice?: number;
  quantity?: number;
  Amount?: number;
  discount?: number;
  debitNote?: DebitNote;
}



export interface DebitNote {
  id?: string;
  debitNoteNumber?: string;
  startDate?: Date;
  duedate?: Date;
  notes?: string;
  internalNotes?: string;
  vendor?: Vendor;
  placeOfSupply?: any;
  grossTotal?: number;
  status?: string;
  comapny?: CompanyNew;
  user ?: any ;
}

export interface GoodsShipment {

  id?: string;
  salesOrder?: SalesOrder;
  documentno?: string;
  vendor?: Vendor;
  customer?: CustomeR;
  company?: CompanyNew;
  shipmentDate?: Date;
  status?: string;
  user ?: any ;
}

export interface GoodsShipmentLine {
  id?: string;
  goodsShipment?: GoodsShipment;
  salesOrder?: SalesOrder;
  orderedQty?: number;
  confirmedQty?: number;
  shippedQty?: number;
}

export interface GoodsReceipt {
  id?: string;
  salesOrder?: SalesOrder;
  documentno?: string;
  vendor?: Vendor;
  company?: CompanyNew;
  receivedDate?: Date;
  status?: string;
  comapny?: CompanyNew;
  user ?: any ;
}

export interface GoodsReceiptLine {
  id?: string;
  goodsReceipt?: GoodsReceipt;
  salesOrder?: SalesOrder;
  orderedQty?: number;
  confirmedQty?: number;
  shippedQty?: number;
  receivedQty?: number;
  landingcost?: number;
}

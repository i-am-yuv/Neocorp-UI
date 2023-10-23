import { Product, State } from "../profile/profile-models";
import { CustomeR, Vendor } from "../settings/customers/customer";

export class InvoiceModel {
}
export interface SalesOrder{
    id?: string;
    documentno ?: string;
    company ?: CompanyNew ;
    billDate ?: Date;
    dueDate ?: Date;
    customer ?: CustomeR;
    termsOfPayments ?: string;
    termsOfDelivery ?: string;
    placeOfSupply ?: State;
    vendor?: Vendor; 
}


export interface SalesInvoice {
  id?: string;
  invoiceNo ?: string;
  vendorInvoice ?: VendorInvoice;
  salesOrder ?: SalesOrder;
  invoiceDate ?: Date;
  customer ?: CustomeR | undefined;
  vendor ?: Vendor;
  grossTotal ?: number;
  status ?: string;
}

export interface SalesInvoiceLine{
  id ?: string;
  expenseName ?: Product ;
  unitPrice ?: number ;
  quantity ?: number ;
  Amount ?: number;
  discount ?: number;
  salesInvoice ?: SalesInvoice;
}

export interface VendorInvoice {
  id?: string;
  documentnumber ?: string;
  status ?: string;
  orderDate ?: Date;
  dueDate ?: Date;
  vendor ?: Vendor;
  grosstotal ?: number;
  description?:string;
  
}

export interface VendorInvoiceLine{
  id ?: string;
  expenseName ?: Product ;
  unitPrice ?: number ;
  quantity ?: number ;
  Amount ?: number;
  discount ?: number;
  vendorInvoice ?: VendorInvoice;
}

export interface SalesOrderLine{
    id ?: string;
    expenseName ?: Product ;
    unitPrice ?: number ;
    quantity ?: number ;
    Amount ?: number;
    discount ?: number;
    salesOrder ?: SalesOrder;
  }

  export interface CreditNote{
    id ?: string;
    creditNoteNo ?: string;
    startdate ?: Date;
    duedate ?: Date;
    customer ?: CustomeR ;
    vendor ?: Vendor;
    placeOfSupply ?: any;
    creditNoteDescription ?: string;
    notes ?: string;
    grossTotal ?: number;
    requestStatus ?: string;
  }

  export interface cnLineItem{
    id ?: string;
    expenseName ?: Product ;
    unitPrice ?: number ;
    quantity ?: number ;
    Amount ?: number;
    discount ?: number;
    creditNote?: CreditNote;
  }

  export interface CashMemo{
    id ?: string;
    cashMemoNumber ?: string;
    startDate ?: Date;
    dueDate ?: Date;
    customer ?: CustomeR ;
    vendor ?: Vendor;
    internalNotes ?: string;
    decription ?: string;
    grossTotal ?: number;
    requestStatus ?: string;
  }

  export interface CashMemoLine{
    id ?: string;
    expenseName ?: Product ;
    unitPrice ?: number ;
    quantity ?: number ;
    Amount ?: number;
    discount ?: number;
    cashMemo?: CashMemo;
  }

  export interface CompanyNew {
    id?: string;
    companyName?: string;
    companyLocation?: string;
    companyPanNumber?: string;
    companyAddress1?: string;
    companyAddress2?: string;
    companyPhone?: string;
    companyMail?: string;
    pincode?: string;
    subscriptionActive?: boolean;
    subscriptionActivationDate?: Date;
    subscriptionValidTill?: Date;
    subscriptionMonths ?: number;
    numberOfStores?: number;
    numberOfDistributors?: number;
    state?: any;
    country?: any;
    dealerCode ?: any;
}
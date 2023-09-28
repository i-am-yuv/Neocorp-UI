import { Product } from "../profile/profile-models";
import { CustomeR, Vendor } from "../settings/customers/customer";

export class InvoiceModel {
}
export interface SalesOrder{
    id?: string;
    documentno ?: string;
    company ?: CompanyNew ;
    billDate ?: Date;
    dueDate ?: Date;
    vendor ?: Vendor;
    termsOfPayments ?: string;
    termsOfDelivery ?: string;
    dispatchTo ?: any;
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
    creditToCustomer ?: CustomeR ;
    creditToVendor ?: Vendor;
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
import { SalesOrder } from "../invoice/invoice-model";
import { Product } from "../profile/profile-models";

export class PayModel {
}

export interface ReturnRefund{
    id ?: string;
    documentNo ?: string;
    refund ?: boolean;
    processDate ?: Date;
    salesOrder ?: SalesOrder;
    grossTotal ?: number;
    reason ?: string;
  }

  // export interface OrderLine{
  //   id ?: string;
  //   order ?: SalesOrder;
  // }

  export interface ReturnRefundLine{
    id ?: string;
    expenseName ?: Product ;
    unitPrice ?: number ;
    quantity ?: number ;
    Amount ?: number;
    discount ?: number;
    returnRefund?: ReturnRefund;
  }
import { CompanyNew, SalesOrder } from "../invoice/invoice-model";
import { Product } from "../profile/profile-models";
import { Vendor } from "../settings/customers/customer";

export class PayModel {
}

export interface ReturnRefund {
  id?: string;
  orderNo?: string;
  refund ?: boolean ;
  return ?: boolean ;
  processDate?: Date;
  salesOrder?: SalesOrder;
  grossTotal?: number;
  reason?: string;
  comapny?: CompanyNew;
  user?: any;
}

// export interface OrderLine{
//   id ?: string;
//   order ?: SalesOrder;
// }

export interface ReturnRefundLine {
  id?: string;
  expenseName?: Product;
  unitPrice?: number;
  quantity?: number;
  Amount?: number;
  discount?: number;
  returnRefund?: ReturnRefund;
  grossTotal?: ReturnRefund;
}
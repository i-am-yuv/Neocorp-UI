import { PurchaseInvoice } from "../collect/collect-models";
import { Beneficiary } from "../profile/profile-models";
import { AccountDetails, CustomeR, Vendor } from "../settings/customers/customer";

export class BankingModel {
}

export interface PaymentRequest {
    id ?: string ;
    amount ?: number;
    paymentType ?: string;
    beneficiary ?: Beneficiary | null ;
    paymentMethod ?: string;
    debitAccountDetails ?: DebitAccountDetails | null;
    upiId ?: string ;
}



export interface PayModelsSI {
    id ?: string;
    invoiceId ?: string;
    customerId ?: string;
    amount ?: number;
    paymentType ?: string;
}

export interface DebitAccountDetails {
    id ?: string;
    AccountType ?: string;
    accountNumber ?: string;
    confirmAccountNumber ?: number;
    IFSC ?: string;
    bankname ?: string;
}

export interface Payment{
    id ?: string;
    vendor ?: Vendor;
    invoice ?: PurchaseInvoice;
    amount ?: number;
    paymentDate ?: Date;
    customer ?: CustomeR
    paymentRequest ?: PaymentRequest;
}



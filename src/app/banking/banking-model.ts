import { PurchaseInvoice } from "../collect/collect-models";
import { Beneficiary } from "../profile/profile-models";
import { AccountDetails, Vendor } from "../settings/customers/customer";

export class BankingModel {
}

export interface PaymentRequest {
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

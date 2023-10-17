import { Beneficiary } from "../profile/profile-models";
import { AccountDetails } from "../settings/customers/customer";

export class BankingModel {
}

export interface PayModelsPI {
    id ?: string;
    invoiceId ?: string;
    vendorId ?: string;
    amount ?: number;
    paymentType ?: string;
    beneficiary ?: Beneficiary | null ;
    accountDetails ?: AccountDetails | null;
    upiId ?: string ;
}

export interface PayModelsSI {
    id ?: string;
    invoiceId ?: string;
    customerId ?: string;
    amount ?: number;
    paymentType ?: string;
}
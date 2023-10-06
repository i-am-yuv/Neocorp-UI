export interface PayModelsPI {
    id ?: string;
    invoiceId ?: string;
    vendorId ?: string;
    amount ?: number;
    paymentType ?: string;
    paymentRequest ?: any ;
}

export interface PayModelsSI {
    id ?: string;
    invoiceId ?: string;
    customerId ?: string;
    amount ?: number;
    paymentType ?: string;
}

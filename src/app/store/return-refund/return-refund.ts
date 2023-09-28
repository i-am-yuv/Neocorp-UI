export interface ReturnRefund {
    id?: string;
    qty?: number;
    amount?: number;
    isRefund?: boolean;
    documentNo?: string;
    order?: any;
    orderLine?: any;
    processDate?: Date;
    reason?: string;
}

export interface PurchaseOrderLine {
    id?: string;
    quantity?: number;
    orderedQuantity?: number;
    confirmedQuantity?: number;
    shippedQuantity?: number;
    receivedQuantity?: number;
    unitprice?: number;
    gst?: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    utgst?: number;
    linetotal?: number;
    discount?: number;
    product?: any;
    purchaseOrder?: any;
}

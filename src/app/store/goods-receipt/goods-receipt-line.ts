import { PurchaseOrderLine } from "../purchase-order/purchase-order-line";
import { StoreCatalog } from "../store-catalog/store-catalog";
import { GoodsReceipt } from "./goods-receipt";

export interface GoodsReceiptLine {
    id?: string;

    goodsReceipt?: GoodsReceipt;

    purchaseOrderLine?: PurchaseOrderLine;

    orderedQty?: number;

    receivedQty?: number;

    storeCatalog?: StoreCatalog;

    landingcost?: number;

    confirmedQty?: number;

    shippedQty?: number;

}
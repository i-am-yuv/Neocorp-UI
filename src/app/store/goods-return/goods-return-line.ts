import { DistributorCatalog } from "src/app/distributor/distributor-catalog/distributor-catalog";
import { PurchaseOrderLine } from "../purchase-order/purchase-order-line";
import { StoreCatalog } from "../store-catalog/store-catalog";
import { GoodsReturn } from "./goods-return";

export interface GoodsReturnLine {
    id?: string;

    goodsReturn?: GoodsReturn;

    purchaseOrderLine?: PurchaseOrderLine;

    receivedQty?: number;

    storeCatalog?: StoreCatalog;

    distributorCatalog?: DistributorCatalog;

    unitprice?: number;

    returnedQty?: number;

    acceptedQty?: number;

}

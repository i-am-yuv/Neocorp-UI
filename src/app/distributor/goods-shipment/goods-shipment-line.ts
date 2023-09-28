import { PurchaseOrderLine } from "src/app/store/purchase-order/purchase-order-line";
import { DistributorCatalog } from "../distributor-catalog/distributor-catalog";
import { GoodsShipment } from "./goods-shipment";

export interface GoodsShipmentLine {
    id?: string;

    goodsShipment?: GoodsShipment;

    purchaseOrderLine?: PurchaseOrderLine;

    orderedQty?: number;

    receivedQty?: number;

    distributorCatalog?: DistributorCatalog;

    landingcost?: number;

    confirmedQty?: number;

    shippedQty?: number;

}

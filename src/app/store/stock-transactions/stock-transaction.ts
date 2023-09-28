import { DistributorCatalog } from "src/app/distributor/distributor-catalog/distributor-catalog";
import { Store } from "src/app/masters/stores/store";
import { GoodsReceiptLine } from "../goods-receipt/goods-receipt-line";
import { Inventory } from "../inventory/inventory";
import { StoreCatalog } from "../store-catalog/store-catalog";

export interface StockTransaction {
    id?: string;
    storeCatalog?: StoreCatalog;
    distributorCatalog?: DistributorCatalog;
    store?: Store;
    storage?: Storage;
    movementDate?: Date;
    type?: string;
    inventory?: Inventory;
    orderLine?: any;
    goodsReceiptLine?: GoodsReceiptLine;
    quantity?: number;
    beforeQuantity?: number;
    afterQuantity?: number;
}

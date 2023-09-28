import { Product } from "src/app/masters/products/product";
import { Store } from "src/app/masters/stores/store";

export interface Storage {
    id?: string;
    name?: string;
    qtyOnHand?: number;
    store?: Store;
    warehouse?: any;
    product?: Product;
}
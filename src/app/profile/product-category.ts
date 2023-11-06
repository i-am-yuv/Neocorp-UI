import { ProductCategories } from "../masters/product-categories/product-categories";
import { Product } from "../settings/customers/customer";
import { ProductComponent } from "./product/product.component";

export interface ProductCategory {
    id ?: string ;
    name ?: string;
    searchKey ?: string;
    description ?: string ;
    parent ?:ProductCategory ;
    user ?: any ;
    // category?:string;
    
}

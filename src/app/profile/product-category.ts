export interface ProductCategory {
    id ?: string ;
    name ?: string;
    searchKey ?: string;
    description ?: string ;
    parent ?:ProductCategory ;
}

export interface Discount {
    id?: string;
    typeValue?: boolean;
    discountName?: string;
    discountValue?: string;
    discountPercentage?: string;
    coupounCode?: string;
    validFrom?: Date;
    validTill?: Date;
    storeCatalog?: any;
    store?: any;
}
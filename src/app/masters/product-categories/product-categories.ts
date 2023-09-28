import { FormControl } from "@angular/forms";

export interface ProductCategories {
    id?: string;
    name?: string;
    searchKey?: string;
    description?: string;
    thumbnail?: string;
    parent?: string;
}

export interface ProductCategoriesForm {
    id?: FormControl<string | null>;
    name?: FormControl<string | null>;
    searchKey?: FormControl<string | null>;
    description?: FormControl<string | null>;
    thumbnail?: FormControl<string | null>;
    parent?: FormControl<string | null>;
}
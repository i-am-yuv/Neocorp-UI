import { FormControl } from "@angular/forms";

export interface Brand {
    id?: string;
    searchkey?: string;
    name?: string;
    description?: string;
}

export interface BrandForm {
    id?: FormControl<string | null>;
    searchkey?: FormControl<string | null>;
    name?: FormControl<string | null>;
    description?: FormControl<string | null>;
}

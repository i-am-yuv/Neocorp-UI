import { FormControl } from "@angular/forms";

export interface TaxRate {
    id?: string;
    taxRateName?: string;
    gst?: number;
    igst?: number;
    cgst?: number;
    sgst?: number;
    utgst?: number;
}

export interface TaxRateForm {
    id?: FormControl<string | null>;
    taxRateName?: FormControl<string | null>;
    gst?: FormControl<number | null>;
    igst?: FormControl<number | null>;
    cgst?: FormControl<number | null>;
    sgst?: FormControl<number | null>;
    utgst?: FormControl<number | null>;
}

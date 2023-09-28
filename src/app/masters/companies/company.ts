import { FormControl } from "@angular/forms";

export interface Company {
    id?: string;
    companyName?: string;
    companyLocation?: string;
    companyPanNumber?: string;
    companyAddress1?: string;
    companyAddress2?: string;
    companyPhone?: string;
    companyMail?: string;
    pincode?: string;
    subscriptionActive?: boolean;
    subscriptionActivationDate?: Date;
    subscriptionValidTill?: Date;
    numberOfStores?: number;
    numberOfDistributors?: number;
    subscriptionMonths?: number;
    saleSubscriptionBalance?: number;
    purchaseSubscriptionBalance?: number;
    state?: any;
    country?: any;
}

export interface CompanyForm {
    id?: FormControl<string | null>;
    companyName?: FormControl<string | null>;
    companyLocation?: FormControl<string | null>;
    companyPanNumber?: FormControl<string | null>;
}
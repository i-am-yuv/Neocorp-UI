import { FormControl } from "@angular/forms";

export interface User {
    id?: string;
    email?: string;
    userName?: string;
    password?: string;
    memberOf?: string;
    company?: string;
    roles?: any;
    isActive?: boolean;
}


export interface UserForm {
    id?: FormControl<string>;
    userName?: FormControl<string>;
    password?: FormControl<string>;
    memberOf?: FormControl<string>;
    roles?: any;
}
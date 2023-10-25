import { Privilege } from "../privilege/privilege";

export interface Roles {
    id?: string;
    name?: string;
    description?: string;
    roleType?: string;
    privileges?:Privilege;
}

export interface Workflow {
    makerRole? : Roles; 
    checkerRole? : Roles;
    isIncrease? : boolean;
    isSanctioner? : boolean;
    isRatificationer? : boolean;
    description?:string;
}


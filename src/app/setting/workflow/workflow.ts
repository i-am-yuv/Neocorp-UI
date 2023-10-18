import { Roles } from "../roles/roles";

export interface Workflow {
    makerRole? : Roles; 
    checkerRole? : Roles;
    isIncrease? : boolean;
    isSanctioner? : boolean;
    isRatificationer? : boolean;
    description?:string;
}

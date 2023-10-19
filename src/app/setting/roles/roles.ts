export interface Roles {
    id?: string;
    name?: string;
    description?: string;
    roleType?: string;
}

export interface Workflow {
    makerRole? : Roles; 
    checkerRole? : Roles;
    isIncrease? : boolean;
    isSanctioner? : boolean;
    isRatificationer? : boolean;
    description?:string;
}


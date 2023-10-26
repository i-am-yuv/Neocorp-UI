// import { Roles } from "./roles/roles";

export class SettingModels {

}

export interface Roles {
    id?: string;
    name?: string;
    description?: string;
    roleType?: string;
    privileges?: Privilege;
}

export interface Workflow {
    makerRole?: Roles;
    checkerRole?: Roles;
    isIncrease?: boolean;
    isSanctioner?: boolean;
    isRatificationer?: boolean;
    description?: string;
}

export interface Privilege {
    id?: string;
    name?: string;
    controllerIdentifier?: string;
    methodIdentifier?: string;
    apiPath?: string;
    description?: string;
    allowAll?: boolean;
    roles?: any;
}
export interface DelegationRole {
    id?: string;
    delegationName?: string;
    delegationAmount?: number;
    delegationDescription?: string;
    role?: Roles;
}


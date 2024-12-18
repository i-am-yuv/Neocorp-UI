// import { Roles } from "./roles/roles";

export class SettingModels {

}

export interface Roles {
    id?: string;
    name?: string;
    description?: string;
    roleType?: string;
    privileges?: Privilege;
    user ?: any ;
}

export interface Workflow {
    id?: string;
    makerRole?: Roles;
    checkerRole?: Roles;
    increase?: boolean;
    sanctioner?: boolean;
    ratificationer?: boolean;
    description?: string;
    user ?: any ;
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
    user ?: any ;
}
export interface DelegationRole {
    id?: string;
    delegationName?: string;
    delegationAmount?: number;
    delegationDescription?: string;
    role?: Roles;
    user ?: any ;
}


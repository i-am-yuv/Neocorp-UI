import { Roles } from "../roles/roles";

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
 export interface DelegationRole{
    id ?: string ;
    delegationName?: string;
    delegationAmount?: number;
    delegationDescription?: string;
    role?: Roles;
 }
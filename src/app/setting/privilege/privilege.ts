import { Roles } from "../setting-models";

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
 export interface DelegationRole{
    id ?: string ;
    delegationName?: string;
    delegationAmount?: number;
    delegationDescription?: string;
    role?: Roles;
    user ?: any ;
 }
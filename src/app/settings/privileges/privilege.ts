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
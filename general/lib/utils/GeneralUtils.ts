import { Construct } from 'constructs';
import { RemovalPolicy, StackProps } from 'aws-cdk-lib';

export const getRemovalPolicy = (envFlavor: EnvFlavor, removalPolicy?: RemovalPolicy): RemovalPolicy => {
    return removalPolicy ? removalPolicy : envFlavor === EnvFlavor.PROD ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;
};

export enum EnvFlavor {
    PROD,
    NONE_PROD
}

export interface GeneralProperties extends StackProps {
    envFlavor: EnvFlavor;
    removalPolicy?: RemovalPolicy;
}

export const getAccountId = (accountId?: string): string => {
    return accountId ? accountId : defaultAccountId;
};

export const getRegion = (region?: string): string => {
    return region ? region : defaultRegion;
};

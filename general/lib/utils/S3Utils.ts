import { EnvFlavor, GeneralProperties } from '../utils/GeneralUtils';
import { CorsRule, LifecycleRule } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { route53Domain } from './../stacks/Consts';
import { S3BucketConstruct } from '../constructs/S3BucketConstruct';

export interface BucketProperties extends GeneralProperties {
    bucketName: string;
    isVersioned?: boolean;
    emptyBeforeDelete?: boolean;
    websiteIndexDocName?: string;
    websiteErrorDocName?: string;
    readAccessExternalAccountIds?: string[];
    additionalReadPermissions?: string[];
    writeAccessExternalAccountIds?: string[];
    s3ReadPolicyConditions?: { [key: string]: any };
    allowVPCInternalAccess?: boolean;
    vpcEndpoints?: string[];
    corsRules?: CorsRule[];
    applyObjectsTimeExpiration?: boolean; // enable bucket level ttl
    bucketTtl?: number; // days
}

export enum BucketPolicyType {
    READ_ACCESS,
    WRITE_ACCESS
}

export const getCorsAllowedOrigins = (envFlavor: EnvFlavor, environmentName: string): string[] => {
    const envOrigin: string = environmentName === 'prod1' ? `https://${route53Domain}` : `https://${environmentName}.${route53Domain}`;
    return envFlavor === EnvFlavor.PROD ? [envOrigin] : ['*'];
};

export const getCommonS3Props = (removalPolicy: RemovalPolicy, bucketName: string, envFlavor: EnvFlavor, isVersioned?: boolean): BucketProperties => {
    return {
        isVersioned: isVersioned ? isVersioned : false,
        removalPolicy: removalPolicy,
        emptyBeforeDelete: removalPolicy === RemovalPolicy.DESTROY ? true : false,
        bucketName: bucketName,
        envFlavor: envFlavor
    };
};

export const getS3BucketAndObjectsArns = (bucketArns: string[]): string[] => {
    return bucketArns.flatMap((arn: string): string[] => {
        return [arn, `${arn}/*`];
    });
};

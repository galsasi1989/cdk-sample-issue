import { IAMPolicyStatementProperties } from './../utils/IAMUtils';
import { RemovalPolicy } from 'aws-cdk-lib';

/* AWS Accounts and Networking constants */
export const s3VpcEndpoint: string = '*******';
export const defaultRegion: string = 'us-east-1';
export const defaultAccountId: string = '********';

export const route53Domain = '*******';

/* S3 constants */
// Internal(in DEEP Account) Buckets
export const deepBucketNamePrefix: string = '********';
export const sdkDocsBucketName: string = `${deepBucketNamePrefix}.sdk-docs`;

// S3 Buckets common properties
export const defaultObjectsExpirationTime: number = 14; // days
export const bucketsNoneProdConfiguration: { [key: string]: any } = {
    isVersioned: false,
    removalPolicy: RemovalPolicy.DESTROY,
    emptyBeforeDelete: true
};
export const bucketsProdConfiguration: { [key: string]: any } = {
    isVersioned: false,
    removalPolicy: RemovalPolicy.RETAIN
};

/* CDK's default environment parameters */
export const defaultEnv: { [key: string]: string } = {
    account: defaultAccountId,
    region: defaultRegion
};

import { Construct } from 'constructs';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BucketProps, BucketEncryption, ObjectOwnership, BlockPublicAccess, CorsRule } from 'aws-cdk-lib/aws-s3';
import { IPrincipal, ArnPrincipal, PolicyStatement, StarPrincipal } from 'aws-cdk-lib/aws-iam';
import { s3VpcEndpoint, defaultObjectsExpirationTime } from './../stacks/Consts';
import { getRemovalPolicy } from './../utils/GeneralUtils';
import { IAMPolicyStatementProperties } from './../utils/IAMUtils';
import { BucketProperties, BucketPolicyType } from './../utils/S3Utils';
import { IAMPolicyStatementConstruct } from './IAMPolicyStatementConstruct';

export class S3BucketConstruct extends Construct {
    readonly s3Bucket: Bucket;
    private properties: BucketProperties;

    constructor(scope: Construct, id: string, props: BucketProperties) {
        super(scope, id);
        const removalPolicy = getRemovalPolicy(props.envFlavor, props.removalPolicy);
        const bucketTtl: Duration = props.bucketTtl ? Duration.days(props.bucketTtl) : Duration.days(defaultObjectsExpirationTime);

        const bucketProperties: BucketProps = {
            bucketName: props.bucketName,
            versioned: props.isVersioned, // default: false
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: removalPolicy,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            autoDeleteObjects: removalPolicy === RemovalPolicy.DESTROY ? true : false,
            websiteIndexDocument: props.websiteIndexDocName,
            websiteErrorDocument: props.websiteIndexDocName ? props.websiteErrorDocName : undefined,
            objectOwnership: props.writeAccessExternalAccountIds ? ObjectOwnership.BUCKET_OWNER_PREFERRED : ObjectOwnership.OBJECT_WRITER,
            lifecycleRules: props.applyObjectsTimeExpiration ? [{ expiration: bucketTtl }] : undefined
        };

        this.properties = props;
        this.s3Bucket = new Bucket(this, 's3Bucket', bucketProperties);

        this.addCrossAccountBucketPolicy(BucketPolicyType.READ_ACCESS);
        this.addCrossAccountBucketPolicy(BucketPolicyType.WRITE_ACCESS);
        this.allowInternalVPCAccessS3Bucket();

        this.properties.corsRules?.forEach((rule: CorsRule): void => {
            this.s3Bucket.addCorsRule(rule);
        });
    }

    private addCrossAccountBucketPolicy(policyType: BucketPolicyType): void {
        const additionalReadPermissions: string[] = this.properties.additionalReadPermissions ? this.properties.additionalReadPermissions : [];
        const accountsArray: string[] | undefined =
            policyType === BucketPolicyType.READ_ACCESS ? this.properties.readAccessExternalAccountIds : this.properties.writeAccessExternalAccountIds;
        const s3permissions: string[] =
            policyType === BucketPolicyType.READ_ACCESS ? ['s3:GetObject', 's3:ListBucket'].concat(additionalReadPermissions) : ['s3:PutObject*'];
        const s3Resources: string[] =
            policyType === BucketPolicyType.READ_ACCESS ? [this.s3Bucket.bucketArn, `${this.s3Bucket.bucketArn}/*`] : [`${this.s3Bucket.bucketArn}/*`];
        const s3PolicyConditions: { [key: string]: string } | undefined =
            policyType === BucketPolicyType.WRITE_ACCESS
                ? { StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' } }
                : this.properties.s3ReadPolicyConditions;

        let rootArnArray: IPrincipal[] | undefined;
        if (accountsArray) {
            rootArnArray = accountsArray.map((accountId: string): ArnPrincipal => {
                return new ArnPrincipal(`arn:aws:iam::${accountId}:root`);
            });

            const policyContent: IAMPolicyStatementProperties = {
                actions: s3permissions,
                resources: s3Resources,
                principals: rootArnArray,
                conditions: s3PolicyConditions
            };

            const action: string = policyType === BucketPolicyType.READ_ACCESS ? 'Read' : 'Write';
            const bucketPolicyStatement: PolicyStatement = new IAMPolicyStatementConstruct(this, `s3AccessPolicyStatement${action}`, policyContent)
                .policyStatement;
            this.s3Bucket.addToResourcePolicy(bucketPolicyStatement);
        }
    }

    private allowInternalVPCAccessS3Bucket(): void {
        if (this.properties.allowVPCInternalAccess) {
            const s3permissions: string[] = ['s3:GetObject'];
            const s3Resources: string[] = [`${this.s3Bucket.bucketArn}/*`];
            const vpcEndpoints: string[] = this.properties.vpcEndpoints ? this.properties.vpcEndpoints : [s3VpcEndpoint];
            const s3PolicyConditions: { [key: string]: any } = { StringEquals: { 'aws:SourceVpce': vpcEndpoints } };
            const policyContent: IAMPolicyStatementProperties = {
                actions: s3permissions,
                resources: s3Resources,
                principals: [new StarPrincipal()],
                conditions: s3PolicyConditions
            };

            const internalAccessBucketPolicyStatement: PolicyStatement = new IAMPolicyStatementConstruct(
                this,
                's3InternalAccessPolicyStatement',
                policyContent
            ).policyStatement;
            this.s3Bucket.addToResourcePolicy(internalAccessBucketPolicyStatement);
        }
    }
}

import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import { S3BucketConstruct } from './../../constructs/S3BucketConstruct';
import { BucketProperties } from './../../utils/S3Utils';

export class S3BucketStack extends Stack {
    readonly bucketConstruct: S3BucketConstruct;

    constructor(scope: Construct, id: string, props: BucketProperties) {
        super(scope, id, props);

        this.bucketConstruct = new S3BucketConstruct(this, 'bucketConstruct', props);
    }
}

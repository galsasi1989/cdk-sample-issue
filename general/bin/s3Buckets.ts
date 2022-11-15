#!/usr/bin/env node
import 'source-map-support/register';
import { RemovalPolicy } from 'aws-cdk-lib';
import { generalApp } from './app';
import {
    deepBucketNamePrefix,
    sdkDocsBucketName,
    bucketsNoneProdConfiguration,
    bucketsProdConfiguration,
} from './../lib/stacks/Consts';
import { EnvFlavor, getRemovalPolicy } from './../lib/utils/GeneralUtils';
import { getCommonS3Props, BucketProperties } from './../lib/utils/S3Utils';
import { S3BucketStack } from './../lib/stacks/components/S3BucketStack';

new S3BucketStack(generalApp, 'sdkDocsBucket', {
    ...bucketsNoneProdConfiguration,
    bucketName: sdkDocsBucketName,
    envFlavor: EnvFlavor.PROD,
    allowVPCInternalAccess: true,
    websiteIndexDocName: 'index.html',
    websiteErrorDocName: 'index.html'
});


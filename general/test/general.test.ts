import { expect as expectCDK, matchTemplate, MatchStyle } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { S3BucketStack } from '../lib/stacks/components/S3BucketStack';
import { EnvFlavor } from '../lib/utils/GeneralUtils';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new S3BucketStack(app, 'MyTestStack', { envFlavor: EnvFlavor.NONE_PROD, bucketName: 'cdk-test-bucket' });
    // THEN
    expectCDK(stack).to(
        matchTemplate(
            {
                Resources: {}
            },
            MatchStyle.EXACT
        )
    );
});

/*const testRdsDBProps: RdsAuroraServerlessDBProperties = {
    environmentName: 'test',
    serviceName: 'upgrade-version',
    dbName: 'test',
    rdsUsername: 'test',
    vpc: generalResources.vpc,
    subnets: generalResources.externalSubnets,
    engine: DatabaseClusterEngine.auroraPostgres({ version: rdsPostgresDbEngineVersion }),
    envFlavor: EnvFlavor.NONE_PROD
}; */

/*const testRedisProps: RedisDBProperties = {
    serviceName: 'test',
    environmentName: 'test',
    envFlavor: EnvFlavor.NONE_PROD
    //redisVersion: '5.0.6',
    //parameterGroupName: 'default.redis5.0'
};

new RedisDBStack(generalApp, 'testRedisDB', testRedisProps); */

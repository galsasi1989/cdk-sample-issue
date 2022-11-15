import { Construct } from 'constructs';
import { Effect, PolicyStatement, PolicyStatementProps } from 'aws-cdk-lib/aws-iam';
import { IAMPolicyStatementProperties } from './../utils/IAMUtils';

export class IAMPolicyStatementConstruct extends Construct {
    readonly policyStatement: PolicyStatement;

    constructor(scope: Construct, id: string, props: IAMPolicyStatementProperties) {
        super(scope, id);

        const statementEffect: Effect = props.effect ? props.effect : Effect.ALLOW;

        const policyStatementProperties: PolicyStatementProps = {
            sid: props.sid,
            resources: props.resources,
            notResources: props.notResources,
            conditions: props.conditions,
            actions: props.actions,
            principals: props.principals,
            effect: statementEffect
        };

        this.policyStatement = new PolicyStatement(policyStatementProperties);
    }
}

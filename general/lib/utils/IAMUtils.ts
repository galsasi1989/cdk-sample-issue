import { StackProps } from 'aws-cdk-lib';
import { IPrincipal, Effect } from 'aws-cdk-lib/aws-iam';


export interface IAMPolicyStatementProperties extends StackProps {
    actions: string[];
    resources?: string[];
    notResources?: string[];
    sid?: string;
    effect?: Effect;
    principals?: IPrincipal[];
    conditions?: { [key: string]: any };
}

# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## How to run cdk in none-default AWS profile
 Run each cdk command with the flag '--profile <AWS-PROFILE>'

## lib folder
The cdk libraries are under lib folder which contains:
 * utils folder - interfaces per resource type, commonly-used functions and configuration
 * constructs folder - contains the basic components for each resource type that is created by cdk. Each contstruct must be wrapped in a cdk Stack or by another Construct. All the options how to configute the resource are implemented inside the Construct classes.
 * Consts.ts file - contains all the consts variable which are commonly used by constructs and stacks classes.
 * Stack classes - Stacks are initiated by cdk when 'cdk deploy' command is run. It may contain a standalone resource or a group of resources which are connected logically.

## bin folder
Contains all the scripts that can be run by cdk commands. The root of a cdk application(cdk App) is declared inside the file general.ts inside the bin folder

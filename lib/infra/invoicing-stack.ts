import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { APIGatewayInfra } from './apigateway'
import { CognitoInfra } from './cognito'
import { DynamoDBInfra } from './dynamodb'

export class InvoicingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new DynamoDBInfra(this);
    new CognitoInfra(this);
    new APIGatewayInfra(this);
  }
}

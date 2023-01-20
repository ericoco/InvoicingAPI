import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class DefaultHandler extends Construct {
  handler: NodejsFunction
  
  constructor(scope: Construct, id: string) {
    super(scope, id)
    this.handler = new NodejsFunction(this, 'function', {
      entry: path.join(__dirname, '../../src/handlers/default-handler.function.ts')
    });
  }
}

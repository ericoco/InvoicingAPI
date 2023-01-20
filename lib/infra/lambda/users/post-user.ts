import { Construct } from 'constructs';
import { PolicyStatement, Policy } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { TablePermissions } from '../table-permissions'
import * as path from 'path';

export class PostUser extends Construct {
  handler: NodejsFunction

  constructor(scope: Construct) {
    super(scope, PostUser.name)
    this.handler = new NodejsFunction(this, 'function', {
      entry: path.join(__dirname, '../../../src/handlers/users/post-user.function.ts')
    });
    this.handler.addToRolePolicy(TablePermissions.writePermissions())
  }
}

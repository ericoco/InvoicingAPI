import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { TablePermissions } from '../table-permissions'
import * as path from 'path';

export class PostSupplierInvitation extends Construct {
  handler: NodejsFunction;

  constructor(scope: Construct) {
    super(scope, PostSupplierInvitation.name);
    this.handler = new NodejsFunction(this, 'function', {
      entry: path.join(__dirname, '../../../src/handlers/invitations/post-supplier-invitation.function.ts')
    });
    this.handler.addToRolePolicy(TablePermissions.writePermissions())
  }
}

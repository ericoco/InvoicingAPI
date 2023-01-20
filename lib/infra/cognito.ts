import { Stack } from 'aws-cdk-lib';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';

export class CognitoInfra {
  constructor(stack: Stack) {
    const userPool = new UserPool(stack, 'InvoicingUsers', {
      selfSignUpEnabled: true
    });

    const userPoolClient = new UserPoolClient(stack, 'InvoicingUsersClient', {
      userPool: userPool,
      userPoolClientName: 'InvoicingUsersClient',
      authFlows: {
        userPassword: true,
      }
    });

    userPool.addDomain('eassaly', {
      cognitoDomain: {
        domainPrefix: 'eassaly'
      }
    });
  }
}
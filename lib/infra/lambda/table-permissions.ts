import { PolicyStatement, Policy } from 'aws-cdk-lib/aws-iam';

export class TablePermissions {
    static readonly tableArn = 'arn:aws:dynamodb:us-west-2:027940833487:table/Invoicing' 
    
    static writePermissions() : PolicyStatement {
        return new PolicyStatement({
            resources: [TablePermissions.tableArn],
            actions: ['dynamodb:PutItem', 'dynamodb:ConditionCheckItem']
        })
    }

    static queryPermissions() : PolicyStatement {
        return new PolicyStatement({
            resources: [TablePermissions.tableArn],
            actions: ['dynamodb:Query']
        })
    }
}

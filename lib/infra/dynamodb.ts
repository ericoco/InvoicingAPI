import { Stack } from 'aws-cdk-lib';
import { AttributeType, Table, BillingMode, ProjectionType, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDBInfra {
  constructor(stack: Stack) {
    const table = new Table(stack, 'Invoicing', {
      tableName: 'Invoicing',
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: {name: 'SK', type: AttributeType.STRING},
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED
    });

    table.addLocalSecondaryIndex({
      indexName: 'LSI1',
      sortKey: { name: 'Timestamp', type: AttributeType.NUMBER },
      projectionType: ProjectionType.ALL
    });

    table.addLocalSecondaryIndex({
      indexName: 'LSI2',
      sortKey: { name: 'TotalAmount', type: AttributeType.NUMBER },
      projectionType: ProjectionType.ALL
    });
    
    table.addLocalSecondaryIndex({
      indexName: 'LSI3',
      sortKey: { name: 'OutstandingAmount', type: AttributeType.NUMBER },
      projectionType: ProjectionType.ALL
    });
    
    table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {name: 'GSI1PK', type: AttributeType.STRING},
      sortKey: {name: 'GSI1SK', type: AttributeType.STRING}
    })

    table.addGlobalSecondaryIndex({
      indexName: 'GSI2',
      partitionKey: {name: 'GSI2PK', type: AttributeType.STRING},
      sortKey: {name: 'GSI2SK', type: AttributeType.STRING}
    })
  }
}

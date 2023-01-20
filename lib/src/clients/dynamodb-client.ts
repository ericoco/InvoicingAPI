import { DynamoDBClient, TransactWriteItem } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    PutCommandOutput,
    GetCommand,
    GetCommandOutput,
    QueryCommand,
    QueryCommandOutput,
    TransactWriteCommand,
    TransactWriteCommandInput,
    TransactWriteCommandOutput
} from "@aws-sdk/lib-dynamodb";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { Item } from '../models/base'

export type Condition = {
    ConditionExpression: string,
    Key: object
}

export class DDbClient {
    static readonly tableName = 'Invoicing'
    static readonly newItemCondition = 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
    static readonly existingItemCondition = 'attribute_exists(PK) AND attribute_exists(SK)'
    ddbClient: DynamoDBClient
    ddbDocumentClient: DynamoDBDocumentClient

    constructor() {
        this.ddbClient = new DynamoDBClient({});
        this.ddbDocumentClient = DynamoDBDocumentClient.from(this.ddbClient)
    }

    writeItem(item: Item): Promise<PutCommandOutput> {
        return this.ddbDocumentClient.send(
            new PutCommand({
                TableName: DDbClient.tableName,
                ConditionExpression: DDbClient.newItemCondition,
                Item: item.toItem()
            })
        );
    }
    
    itemExistsCondition(item: Item): Condition {
        return {
            ConditionExpression: DDbClient.existingItemCondition,
            Key: item.toKey()
        }
    }
    
    conditionalWriteItems(conditionItems: Condition[], items: Item[]): Promise<TransactWriteCommandOutput> {
        let transactions : any[] = []
        
        conditionItems.forEach((condition: Condition) => {
            transactions.push({
                ConditionCheck: {
                    TableName: DDbClient.tableName,
                    ConditionExpression: condition.ConditionExpression,
                    Key: condition.Key
                }
            })
        })

        items.forEach((item: Item) => {
            transactions.push({
                Put: {
                    TableName: DDbClient.tableName,
                    ConditionExpression: DDbClient.newItemCondition,
                    Item: item.toItem()
                }
            })
        })
 
        return this.ddbDocumentClient.send(
            new TransactWriteCommand({
                TransactItems: transactions
            })
        )
    }

    query(pkVal: string): Promise<QueryCommandOutput> {
        return this.ddbDocumentClient.send(
            new QueryCommand({
                TableName: DDbClient.tableName,
                KeyConditionExpression: `PK = :val`,
                ExpressionAttributeValues: {
                    ':val': pkVal
                }
            })
        );
    }

    queryGSI(indexName: string, gsipkValue: string): Promise<QueryCommandOutput> {
        return this.ddbDocumentClient.send(
            new QueryCommand({
                TableName: DDbClient.tableName,
                IndexName: indexName,
                KeyConditionExpression: `${indexName}PK = :val`,
                ExpressionAttributeValues: {
                    ':val': {
                        S: gsipkValue
                    }
                }
            })
        );
    }
}

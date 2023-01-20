import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DDbClient } from '../../clients/dynamodb-client'
import { Supplier } from '../../models/supplier'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    let body
    let statusCode = 200
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      const supplier = new Supplier(context.awsRequestId)
      await client.writeItem(supplier)
      body = `Created supplier ${context.awsRequestId}`
    } catch (e) {
      statusCode = 500
      body = JSON.stringify(e)
    } finally {
      body = JSON.stringify(body)
    }

    return {
      statusCode,
      body,
      headers
    }
}

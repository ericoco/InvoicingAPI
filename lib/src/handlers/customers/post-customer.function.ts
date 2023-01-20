import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DDbClient } from '../../clients/dynamodb-client'
import { Customer } from '../../models/customer'
import { Supplier } from '../../models/supplier'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    let body
    let statusCode = 200
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      let requestJSON = JSON.parse(event.body)
      const supplier = new Supplier(requestJSON.supplierId)
      const supplierCondition = client.itemExistsCondition(supplier)
      const customer = new Customer(requestJSON.supplierId, context.awsRequestId, requestJSON.name)
      await client.conditionalWriteItems([supplierCondition], [customer])
      body = `Created customer ${context.awsRequestId}`
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

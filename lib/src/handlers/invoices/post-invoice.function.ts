import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DDbClient } from '../../clients/dynamodb-client'
import { Item } from '../../models/base'
import { Invoice } from '../../models/invoice'
import { LineItem } from '../../models/line-item'
import { SupplierUser } from '../../models/supplier-user'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    let body
    let statusCode = 200
    const headers = {
      'Content-Type': 'application/json'
    }
    const supplierId = event.pathParameters.id
    try {
      let requestJSON = JSON.parse(event.body)
      const supplierUser = new SupplierUser(requestJSON.userId, requestJSON.supplierId)
      const supplierUserCondition = client.itemExistsCondition(supplierUser)
      let items : Item[] = []
      let sum = 0
      requestJSON.lineItems.forEach((lineItem: any, index: string) => {
        sum += lineItem.totalAmount
        items.push(new LineItem(context.awsRequestId, index, lineItem.totalAmount))
      })
      items.push(new Invoice(context.awsRequestId, requestJSON.customerId, requestJSON.supplierId, sum, sum))
      await client.conditionalWriteItems([supplierUserCondition], items)
      body = 'Linked supplier invitation to user'
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

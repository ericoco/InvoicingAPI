import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DDbClient } from '../../clients/dynamodb-client'
import { PaymentMethod } from '../../models/payment-method'
import { User } from '../../models/user'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    let body
    let statusCode = 200
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      let requestJSON = JSON.parse(event.body)
      const user = new User(requestJSON.userId)
      const userCondition = client.itemExistsCondition(user)
      const paymentMethod = new PaymentMethod(requestJSON.userId, context.awsRequestId)
      await client.conditionalWriteItems([userCondition], [paymentMethod])
      body = `Created payment method ${context.awsRequestId}`
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

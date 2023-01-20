import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DDbClient } from '../../clients/dynamodb-client'
import { CustomerInvitation } from '../../models/customer-invitation'
import { CustomerUser } from '../../models/customer-user'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    const customerId = event.pathParameters.id
    let body
    let statusCode = 200
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      let requestJSON = JSON.parse(event.body)
      const invitation = new CustomerInvitation(customerId, requestJSON.email)
      const invitationCondition = client.itemExistsCondition(invitation)
      const customerUser = new CustomerUser(requestJSON.userId, customerId)
      await client.conditionalWriteItems([invitationCondition], [customerUser])
      body = 'Linked customer invitation to user'
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

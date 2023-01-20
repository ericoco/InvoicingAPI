import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DDbClient } from '../../clients/dynamodb-client'
import { SupplierInvitation } from '../../models/supplier-invitation'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    let body
    let statusCode = 200
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      let requestJSON = JSON.parse(event.body)
      const invitation = new SupplierInvitation(event.pathParameters.id, requestJSON.email)
      await client.writeItem(invitation)
      body = 'Created supplier invitation'
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

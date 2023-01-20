import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DDbClient } from '../../clients/dynamodb-client'
import { SupplierInvitation } from '../../models/supplier-invitation'
import { SupplierUser } from '../../models/supplier-user'
import { User } from '../../models/user'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    const supplierId = event.pathParameters.id
    let body
    let statusCode = 200
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      let requestJSON = JSON.parse(event.body)
      const invitation = new SupplierInvitation(supplierId, requestJSON.email)
      const invitationCondition = client.itemExistsCondition(invitation)
      const supplierUser = new SupplierUser(requestJSON.userId, supplierId)
      await client.conditionalWriteItems([invitationCondition], [supplierUser])
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

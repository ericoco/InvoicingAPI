import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DDbClient } from '../../clients/dynamodb-client'
import { Invoice } from '../../models/invoice'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    let body
    let statusCode = 200
    
    try {
      let requestJSON = JSON.parse(event.queryStringParameters)
      if (requestJSON.customerId) {
        body = await client.queryGSI('GSI1', requestJSON.customerId)
      } else {
        body = await client.queryGSI('GSI2', requestJSON.supplierId)
      }
    } catch (e) {
      statusCode = 500
      body = JSON.stringify(e)
    } finally {
      body = JSON.stringify(body)
    }
    
    return {
        statusCode,
        body
    }
}

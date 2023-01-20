import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { DDbClient } from '../../clients/dynamodb-client'
import { Invoice } from '../../models/invoice'

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new DDbClient()
    let body
    let statusCode = 200
    
    try {
      const invoice = new Invoice(event.pathParameters.id)
      body = await client.query(invoice.pk)
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

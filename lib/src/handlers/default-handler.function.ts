import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 404,
        body: JSON.stringify({
            message: 'Endpoint does not exist',
        })
    }
}

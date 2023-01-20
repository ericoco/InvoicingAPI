import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { User } from './user'

export class PaymentMethod extends Item {
    static readonly prefix = 'PAYMENTMETHOD#'
    userId: string
    id: string

    constructor(userId: string, id: string) {
        super();
        this.userId = userId
        this.id = id
    }

    get pk(): string {
        return `${User.prefix}${this.id}`
    }

    get sk(): string {
        return `${PaymentMethod.prefix}${this.id}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): PaymentMethod {
        return new PaymentMethod(
            getCommandOutput.Item?.PK.replace(User.prefix, ''),
            getCommandOutput.Item?.SK.replace(PaymentMethod.prefix, '')
        )
    }
}

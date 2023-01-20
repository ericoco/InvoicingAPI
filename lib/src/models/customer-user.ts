import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Customer } from './customer'
import { User } from './user'

export class CustomerUser extends Item {
    static readonly prefix = 'CUSTOMERUSER#'
    userId: string
    customerId: string

    constructor(userId: string, customerId: string) {
        super();
        this.userId = userId
        this.customerId = customerId
    }

    get pk(): string {
        return `${User.prefix}${this.userId}`
    }

    get sk(): string {
        return `${Customer.prefix}${this.customerId}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk,
            GSI1PK: this.sk,
            GSI1SK: this.pk
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): CustomerUser {
        return new CustomerUser(
            getCommandOutput.Item?.PK.replace(User.prefix, ''),
            getCommandOutput.Item?.SK.replace(Customer.prefix, '')
        )
    }
}

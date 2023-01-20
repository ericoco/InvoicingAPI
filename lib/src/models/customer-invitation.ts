import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Customer } from './customer'
import { UserEmail } from './user'

export class CustomerInvitation extends Item {
    static readonly prefix = 'CUSTOMERINVITATION#'
    customerId: string
    userEmail: string

    constructor(customerId: string, userEmail: string) {
        super();
        this.customerId = customerId
        this.userEmail = userEmail
    }

    get pk(): string {
        return `${Customer.prefix}${this.customerId}`
    }

    get sk(): string {
        return `${UserEmail.prefix}${this.userEmail}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): CustomerInvitation {
        return new CustomerInvitation(
            getCommandOutput.Item?.PK.replace(Customer.prefix, ''),
            getCommandOutput.Item?.SK.replace(UserEmail.prefix, '')
        )
    }
}

import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Customer } from './customer'
import { Invoice } from './invoice'
import { User } from './user'

export class Comment extends Item {
    static readonly prefix = 'COMMENT#'
    invoiceId: string
    id: string
    customerId: string
    userId: string
    text: string

    constructor(invoiceId: string, id: string, customerId: string, userId: string, text: string) {
        super();
        this.invoiceId = invoiceId
        this.id = id
        this.customerId = customerId
        this.userId = userId
        this.text = text
    }

    get pk(): string {
        return `${Invoice.prefix}${this.id}`
    }

    get sk(): string {
        return `${Comment.prefix}${this.id}`
    }
    
    get gsi1pk(): string {
        return `${Customer.prefix}${this.customerId}#${User.prefix}${this.userId}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk,
            GSI1PK: this.gsi1pk,
            GSI1SK: this.sk,
            text: this.text
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): Comment {
        return new Comment(
            getCommandOutput.Item?.PK.replace(Invoice.prefix, ''),
            getCommandOutput.Item?.SK.replace(Comment.prefix, ''),
            getCommandOutput.Item?.GSI1PK.split('#')[1],
            getCommandOutput.Item?.GSI1PK.split('#')[3],
            getCommandOutput.Item?.text
        )
    }
}

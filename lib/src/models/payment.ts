import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Customer } from './customer'
import { Invoice } from './invoice'
import { User } from './user'

export class Payment extends Item {
    static readonly prefix = 'PAYMENT#'
    invoiceId: string
    id: string
    customerId: string
    userId: string
    totalAmount: number

    constructor(invoiceId: string, id: string, customerId: string, userId: string, totalAmount: number) {
        super();
        this.invoiceId = invoiceId
        this.id = id
        this.customerId = customerId
        this.userId = userId
        this.totalAmount = totalAmount
    }

    get pk(): string {
        return `${Invoice.prefix}${this.id}`
    }

    get sk(): string {
        return `${Payment.prefix}${this.id}`
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
            TotalAmount: this.totalAmount
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): Payment {
        return new Payment(
            getCommandOutput.Item?.PK.replace(Invoice.prefix, ''),
            getCommandOutput.Item?.SK.replace(Payment.prefix, ''),
            getCommandOutput.Item?.GSI1PK.split('#')[1],
            getCommandOutput.Item?.GSI1PK.split('#')[3],
            getCommandOutput.Item?.TotalAmount
        )
    }
}

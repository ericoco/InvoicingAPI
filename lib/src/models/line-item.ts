import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Invoice } from './invoice'

export class LineItem extends Item {
    static readonly prefix = 'LINEITEM#'
    invoiceId: string
    id: string
    totalAmount: number

    constructor(invoiceId: string, id: string, totalAmount: number) {
        super();
        this.invoiceId = invoiceId
        this.id = id
        this.totalAmount = totalAmount
    }

    get pk(): string {
        return `${Invoice.prefix}${this.invoiceId}`
    }

    get sk(): string {
        return `${LineItem.prefix}${this.id}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk,
            TotalAmount: this.totalAmount
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): LineItem {
        return new LineItem(
            getCommandOutput.Item?.PK.replace(Invoice.prefix, ''),
            getCommandOutput.Item?.SK.replace(LineItem.prefix, ''),
            getCommandOutput.Item?.TotalAmount
        )
    }
}

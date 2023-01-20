import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'

export class Supplier extends Item {
    static readonly prefix = 'SUPPLIER#'
    id: string

    constructor(id: string) {
        super();
        this.id = id
    }

    get pk(): string {
        return `${Supplier.prefix}${this.id}`
    }

    get sk(): string {
        return `${Supplier.prefix}${this.id}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): Supplier {
        return new Supplier(getCommandOutput.Item?.PK.replace(Supplier.prefix, ''))
    }
}

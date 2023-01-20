import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Supplier } from './supplier'

export class Customer extends Item {
    static readonly prefix = 'CUSTOMER#'
    supplierId: string
    id: string
    name: string

    constructor(supplierId: string, id: string, name: string) {
        super();
        this.supplierId = supplierId
        this.id = id
        this.name = name
    }

    get pk(): string {
        return `${Supplier.prefix}${this.supplierId}`
    }

    get sk(): string {
        return `${Customer.prefix}${this.id}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk,
            Name: this.name
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): Customer {
        return new Customer(
            getCommandOutput.Item?.PK.replace(Supplier.prefix, ''),
            getCommandOutput.Item?.SK.replace(Customer.prefix, ''),
            getCommandOutput.Item?.Name
        )
    }
}

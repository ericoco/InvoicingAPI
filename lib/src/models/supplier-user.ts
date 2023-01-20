import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Supplier } from './supplier'
import { User } from './user'

export class SupplierUser extends Item {
    static readonly prefix = 'SUPPLIERUSER#'
    userId: string
    supplierId: string

    constructor(userId: string, supplierId: string) {
        super();
        this.userId = userId
        this.supplierId = supplierId
    }

    get pk(): string {
        return `${User.prefix}${this.userId}`
    }

    get sk(): string {
        return `${Supplier.prefix}${this.supplierId}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk,
            GSI1PK: this.sk,
            GSI1SK: this.pk
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): SupplierUser {
        return new SupplierUser(
            getCommandOutput.Item?.PK.replace(User.prefix, ''),
            getCommandOutput.Item?.SK.replace(Supplier.prefix, '')
        )
    }
}

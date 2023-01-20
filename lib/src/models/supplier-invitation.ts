import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Supplier } from './supplier'
import { UserEmail } from './user'

export class SupplierInvitation extends Item {
    static readonly prefix = 'SUPPLIERINVITATION#'
    supplierId: string
    userEmail: string

    constructor(supplierId: string, userEmail: string) {
        super();
        this.supplierId = supplierId
        this.userEmail = userEmail
    }

    get pk(): string {
        return `${Supplier.prefix}${this.supplierId}`
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

    static fromItem(getCommandOutput: GetCommandOutput): SupplierInvitation {
        return new SupplierInvitation(
            getCommandOutput.Item?.PK.replace(Supplier.prefix, ''),
            getCommandOutput.Item?.SK.replace(UserEmail.prefix, '')
        )
    }
}

import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'
import { Customer } from './customer'
import { Supplier } from './supplier'

export class Invoice extends Item {
    static readonly prefix = 'INVOICE#'
    id: string
    customerId: string
    supplierId: string
    totalAmount: number
    outstandingAmount: number

    constructor(id: string,
                customerId: string = '',
                supplierId: string = '',
                totalAmount: number = 0,
                outstandingAmount: number = 0) {
        super()
        this.id = id
        this.customerId = customerId
        this.supplierId = supplierId
        this.totalAmount = totalAmount
        this.outstandingAmount = outstandingAmount
    }

    get pk(): string {
        return `${Invoice.prefix}${this.id}`
    }

    get sk(): string {
        return `${Invoice.prefix}${this.id}`
    }
    
    get gsi1pk(): string {
        return `${Customer.prefix}${this.customerId}`
    }

    get gsi2pk(): string {
        return `${Supplier.prefix}${this.supplierId}`
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk,
            GSI1PK: this.gsi1pk,
            GSI1SK: this.pk,
            GSI2PK: this.gsi2pk,
            GSI2SK: this.pk,
            TotalAmount: this.totalAmount,
            OutstandingAmount: this.outstandingAmount
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): Invoice {
        return new Invoice(
            getCommandOutput.Item?.PK.replace(Invoice.prefix, ''),
            getCommandOutput.Item?.GSI1PK.replace(Customer.prefix, ''),
            getCommandOutput.Item?.GSI2PK.replace(Supplier.prefix, ''),
            getCommandOutput.Item?.TotalAmount,
            getCommandOutput.Item?.OutstandingAmount
        )
    }
}

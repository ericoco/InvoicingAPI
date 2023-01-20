import { DynamoDBDocumentClient, PutCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Item } from './base'

export class UserEmail {
    static readonly prefix = 'USEREMAIL#'
}

export class User extends Item {
    static readonly prefix = 'USER#'
    id: string
    email: string

    constructor(id: string, email: string = '') {
        super();
        this.id = id
        this.email = email
    }

    get pk(): string {
        return `${User.prefix}${this.id}`
    }

    get sk(): string {
        return this.pk
    }

    get gsi1pk(): string {
        return `${UserEmail.prefix}${this.email}`
    }
    
    get gsi1sk(): string {
        return this.gsi1pk
    }

    toObject(): Object {
        return {
            PK: this.pk,
            SK: this.sk,
            GSI1PK: this.gsi1pk,
            GSI1SK: this.gsi1sk
        }
    }

    static fromItem(getCommandOutput: GetCommandOutput): User {
        return new User(getCommandOutput.Item?.PK.replace(User.prefix, ''), getCommandOutput.Item?.Email)
    }
}

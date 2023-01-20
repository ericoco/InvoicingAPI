export abstract class Item {
    abstract get pk(): string
    abstract get sk(): string
    abstract toObject(): Object
    
    toKey(): Object {
        return {
            PK: this.pk,
            SK: this.sk
        }
    }
    
    toItem(): Object {
        return {
            ...this.toObject(),
            Timestamp: Date.now()
        }
    }
}

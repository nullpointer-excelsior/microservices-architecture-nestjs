import * as uuid from 'short-uuid'

export abstract class DomainEvent<T = any> {

    public readonly id: string;
    public readonly occurredOn: Date;
    
    constructor(
        public readonly name: string,
        public readonly payload: T
    ) {
        this.id = uuid.generate();
        this.occurredOn = new Date();
    }

}


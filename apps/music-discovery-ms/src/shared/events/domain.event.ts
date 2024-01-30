import { Uuid } from '../utils/Uuid';

export abstract class DomainEvent<T = any> {

    public readonly id: string;
    public readonly occurredOn: Date;
    
    constructor(
        public readonly name: string,
        public readonly payload: T
    ) {
        this.id = Uuid.generateShort();
        this.occurredOn = new Date();
    }

}


import { IsNotEmpty, IsObject } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { Order } from '../model/orders';
import { DeliverySaga } from '../sagas/DeliverySaga';
import { EventProps } from './event.props';

class Payload {
    
    @IsObject()
    @IsNotEmpty()
    order: Order

}
export class DeliveryTransactionEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: DeliverySaga.TRANSACTION
        })
    }

}
import { SagaEvent } from '../../../sagas/saga.event';
import { Order } from '../model/orders';
import { CreateOrderSaga } from '../sagas/CreateOrderSaga';
import { EventProps } from './event.props';

type Payload = Omit<Order, 'id'>;
export class CreateOrderTransactionEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: CreateOrderSaga.TRANSACTION
        })
    }

}
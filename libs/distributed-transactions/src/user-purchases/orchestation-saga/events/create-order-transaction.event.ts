import { SagaEvent } from '../../../sagas/saga.event';
import { Order } from '../model/orders';
import { CreateOrderSaga } from '../sagas/CreateOrderSaga';

export class CreateOrderTransactionEvent extends SagaEvent<Order>{

    constructor(payload: Order) {
        super(CreateOrderSaga.TRANSACTION, payload)
    }

}
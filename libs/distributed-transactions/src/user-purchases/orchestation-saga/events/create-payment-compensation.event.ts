import { IsUUID } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { CreatePaymentSaga } from '../sagas/CreatePaymentSaga';

class Payload {
    @IsUUID()
    orderId: string;
}

export class CreatePaymentCompensationEvent extends SagaEvent<Payload>{

    constructor(payload: Payload) {
        super(CreatePaymentSaga.COMPENSATION, payload)
    }

}
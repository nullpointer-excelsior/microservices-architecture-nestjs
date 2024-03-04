import { IsEnum, IsUUID } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { CreatePaymentSaga } from '../sagas/CreatePaymentSaga';
import { PaymentStatus } from '../model/payment';

class Payload {
    @IsUUID()
    orderId: string;

    @IsEnum(PaymentStatus)
    status: PaymentStatus;
    
}

export class CreatePaymentOkEvent extends SagaEvent<Payload>{

    constructor(payload: Payload) {
        super(CreatePaymentSaga.OK, payload)
    }

}
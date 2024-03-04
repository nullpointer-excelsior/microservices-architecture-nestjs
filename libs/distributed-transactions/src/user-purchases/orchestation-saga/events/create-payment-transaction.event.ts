import { IsUUID, ValidateNested } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { CreatePaymentSaga } from '../sagas/CreatePaymentSaga';
import { Customer } from '../model/customer';

class Payload {
    @IsUUID()
    orderId: string;

    @ValidateNested()
    customer: Customer;
    
}

export class CreatePaymentTransactionEvent extends SagaEvent<Payload>{

    constructor(payload: Payload) {
        super(CreatePaymentSaga.TRANSACTION, payload)
    }

}
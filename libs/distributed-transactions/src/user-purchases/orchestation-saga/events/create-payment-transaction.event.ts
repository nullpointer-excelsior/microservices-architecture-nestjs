import { IsPositive, IsUUID, ValidateNested } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { CreatePaymentSaga } from '../sagas/CreatePaymentSaga';
import { Customer } from '../model/customer';
import { EventProps } from './event.props';

class Payload {
    
    @IsUUID()
    orderId: string;

    @ValidateNested()
    customer: Customer;
    
    @IsPositive()
    total: number;

}

export class CreatePaymentTransactionEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: CreatePaymentSaga.TRANSACTION
        })
    }

}
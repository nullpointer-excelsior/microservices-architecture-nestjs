import { IsUUID } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { CreatePaymentSaga } from '../sagas/CreatePaymentSaga';
import { EventProps } from './event.props';

class Payload {
    @IsUUID()
    orderId: string;
    @IsUUID()
    paymentId: string;
}

export class CreatePaymentCompensationEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>   ) {
        super({
            ...props,
            pattern: CreatePaymentSaga.COMPENSATION
        })
    }

}
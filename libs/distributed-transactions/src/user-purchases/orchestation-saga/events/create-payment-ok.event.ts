import { IsEnum, IsUUID } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { CreatePaymentSaga } from '../sagas/CreatePaymentSaga';
import { PaymentStatus } from '../model/payment';
import { EventProps } from './event.props';

class Payload {
    @IsUUID()
    orderId: string;

    @IsUUID()
    paymentId: string;

    @IsEnum(PaymentStatus)
    status: PaymentStatus;

}

export class CreatePaymentOkEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: CreatePaymentSaga.OK
        })
    }

}
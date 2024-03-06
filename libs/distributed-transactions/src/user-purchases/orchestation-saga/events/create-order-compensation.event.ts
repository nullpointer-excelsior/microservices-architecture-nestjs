import { IsNotEmpty, IsUUID } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { CreateOrderSaga } from "../sagas/CreateOrderSaga";

class Payload {

    @IsUUID()
    @IsNotEmpty()
    orderId: string;

}

export class CreateOrderCompensationEvent extends SagaEvent<Payload>{

    constructor(props: { transactionId: string, payload: Payload }) {
        super({
            ...props,
            pattern: CreateOrderSaga.COMPENSATION,
        })
    }

}
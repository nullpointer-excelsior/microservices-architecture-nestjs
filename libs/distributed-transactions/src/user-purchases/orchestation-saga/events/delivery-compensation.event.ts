import { IsNotEmpty, IsUUID } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { DeliverySaga } from "../sagas/DeliverySaga";

class Payload {

    @IsUUID()
    @IsNotEmpty()
    deliveryId: string;

}

export class DeliveryCompensationEvent extends SagaEvent<Payload>{

    constructor(props: { transactionId: string, payload: Payload }) {
        super({
            ...props,
            pattern: DeliverySaga.COMPENSATION,
        })
    }

}
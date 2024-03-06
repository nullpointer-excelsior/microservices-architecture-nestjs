import { ValidateNested } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { Order } from "../model/orders";
import { CreateOrderSaga } from "../sagas/CreateOrderSaga";
import { EventProps } from "./event.props";

class Payload {
    
    @ValidateNested()
    order: Order;
    
}

export class CreateOrderOkEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: CreateOrderSaga.OK
        })
    }

}
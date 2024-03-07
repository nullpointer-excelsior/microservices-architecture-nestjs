import { IsObject, ValidateNested } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { Delivery } from "../model/delivery";
import { DeliverySaga } from "../sagas/DeliverySaga";
import { EventProps } from "./event.props";

class Payload {
    
    @IsObject()
    @ValidateNested()
    delivery: Delivery
    
}

export class DeliveryOkEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: DeliverySaga.OK
        })
    }

}
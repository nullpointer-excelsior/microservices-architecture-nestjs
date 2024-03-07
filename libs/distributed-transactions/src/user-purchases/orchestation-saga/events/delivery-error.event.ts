import { IsNotEmpty } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { DeliverySaga } from "../sagas/DeliverySaga";
import { EventProps } from "./event.props";

class Payload {
    
    @IsNotEmpty()
    error: string;
    
    @IsNotEmpty()
    reason: string;

}

export class DeliveryErrorEvent extends SagaEvent<Payload>{
        
        constructor(props: EventProps<Payload>) {
            super({
                ...props,
                pattern: DeliverySaga.ERROR
            })
        }
}
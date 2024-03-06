import { IsNotEmpty } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { CreateOrderSaga } from "../sagas/CreateOrderSaga";
import { EventProps } from "./event.props";

class Payload {
    
    @IsNotEmpty()
    error: string;
    
    @IsNotEmpty()
    reason: string;

}

export class CreateOrderErrorEvent extends SagaEvent<Payload>{
        
        constructor(props: EventProps<Payload>) {
            super({
                ...props,
                pattern: CreateOrderSaga.ERROR
            })
        }
}
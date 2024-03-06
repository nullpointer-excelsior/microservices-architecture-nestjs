import { IsNotEmpty, IsUUID } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { CreatePaymentSaga } from "../sagas/CreatePaymentSaga";
import { EventProps } from "./event.props";

class Payload {
    
    @IsUUID()
    @IsNotEmpty()
    orderId: string;
    
    @IsNotEmpty()
    error: string;
    
    @IsNotEmpty()
    reason: string;

}

export class CreatePaymentErrorEvent extends SagaEvent<Payload>{
        
        constructor(props: EventProps<Payload>) {
            super({
                ...props,
                pattern: CreatePaymentSaga.ERROR
            })
        }
}
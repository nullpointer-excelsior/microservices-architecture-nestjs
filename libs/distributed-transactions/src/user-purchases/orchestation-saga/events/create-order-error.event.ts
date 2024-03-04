import { IsNotEmpty, IsUUID } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { CreateOrderSaga } from "../sagas/CreateOrderSaga";

class Payload {
    
    @IsUUID()
    @IsNotEmpty()
    orderId: string;
    
    @IsNotEmpty()
    error: string;
    
    @IsNotEmpty()
    reason: string;

}

export class CreateOrderErrorEvent extends SagaEvent<Payload>{
        
        constructor(payload: Payload) {
            super(CreateOrderSaga.ERROR, payload)
        }
}
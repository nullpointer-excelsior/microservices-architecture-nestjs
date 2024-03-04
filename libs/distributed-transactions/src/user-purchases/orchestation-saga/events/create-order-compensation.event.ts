import { IsNotEmpty, IsUUID } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { CreateOrderSaga } from "../sagas/CreateOrderSaga";

class Payload {
    
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

}

export class CreateOrderCompensationEvent extends SagaEvent<Payload>{
        
        constructor(payload: Payload) {
            super(CreateOrderSaga.COMPENSATION, payload)
        }
}
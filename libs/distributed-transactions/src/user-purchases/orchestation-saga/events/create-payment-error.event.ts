import { IsNotEmpty, IsUUID } from "class-validator";
import { SagaEvent } from "../../../sagas";
import { CreatePaymentSaga } from "../sagas/CreatePaymentSaga";

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
        
        constructor(payload: Payload) {
            super(CreatePaymentSaga.ERROR, payload)
        }
}
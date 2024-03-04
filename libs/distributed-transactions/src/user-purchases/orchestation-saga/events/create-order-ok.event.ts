import { IsDate, IsEnum, IsUUID } from "class-validator";
import { OrderStatus } from "../model/orders";
import { SagaEvent } from "../../../sagas";
import { CreateOrderSaga } from "../sagas/CreateOrderSaga";

export class Payload {
    
    @IsUUID()
    orderId: string;

    @IsDate()
    createdAt: Date;

    @IsEnum(OrderStatus)
    status: OrderStatus;
    
}

export class CreateOrderOkEvent extends SagaEvent<Payload>{

    constructor(payload: Payload) {
        super(CreateOrderSaga.OK, payload)
    }

}
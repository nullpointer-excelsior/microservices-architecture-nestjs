import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Customer } from "../model/customer";
import { EventProps } from "./event.props";
import { SagaEvent } from "../../../sagas";
import { CreateNotificationSaga } from "../sagas/CreateNotificationSaga";

class Payload {

    @IsString()
    summary: string;

    @ValidateNested()
    customer: Customer;

    @IsNotEmpty()
    error: string;
    
    @IsNotEmpty()
    reason: string;

}

export class CreateNotificationErrorEvent extends SagaEvent<Payload> {
    
    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: CreateNotificationSaga.ERROR
        })
    }
}
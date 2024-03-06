import { IsString, ValidateNested } from "class-validator";
import { Customer } from "../model/customer";
import { EventProps } from "./event.props";
import { SagaEvent } from "../../../sagas";
import { CreateNotificationSaga } from "../sagas/CreateNotificationSaga";

class Payload {

    @IsString()
    summary: string;

    @ValidateNested()
    customer: Customer;

}

export class CreateNotificationTransactionEvent extends SagaEvent<Payload> {
    
    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: CreateNotificationSaga.TRANSACTION
        })
    }
}
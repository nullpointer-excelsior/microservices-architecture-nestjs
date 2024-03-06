import { IsNotEmpty, IsNumber } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { UpdateStockSaga } from '../sagas/UpdateStockSaga';
import { EventProps } from './event.props';

class Payload {
    
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    quantity: number;

}

export class UpdateStockTransactionEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: UpdateStockSaga.TRANSACTION
        })
    }

}
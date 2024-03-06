import { IsNotEmpty } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { UpdateStockSaga } from '../sagas/UpdateStockSaga';
import { EventProps } from './event.props';

class Payload {
    
    @IsNotEmpty()
    sku: string;
    
    @IsNotEmpty()
    error: string;
    
    @IsNotEmpty()
    reason: string;

}

export class UpdateStockErrorEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: UpdateStockSaga.ERROR
        })
    }

}
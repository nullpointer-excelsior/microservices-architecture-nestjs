import { IsNotEmpty } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { UpdateStockSaga } from '../sagas/UpdateStockSaga';

class Payload {
    
    @IsNotEmpty()
    sku: string;
    
    @IsNotEmpty()
    error: string;
    
    @IsNotEmpty()
    reason: string;

}

export class UpdateStockErrorEvent extends SagaEvent<Payload>{

    constructor(payload: Payload) {
        super(UpdateStockSaga.ERROR, payload)
    }

}
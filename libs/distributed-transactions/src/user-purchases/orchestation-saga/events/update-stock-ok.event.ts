import { IsNotEmpty, IsNumber } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { UpdateStockSaga } from '../sagas/UpdateStockSaga';

class Payload {
    
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    quantity: number;

}

export class UpdateStockOkEvent extends SagaEvent<Payload>{

    constructor(payload: Payload) {
        super(UpdateStockSaga.OK, payload)
    }

}
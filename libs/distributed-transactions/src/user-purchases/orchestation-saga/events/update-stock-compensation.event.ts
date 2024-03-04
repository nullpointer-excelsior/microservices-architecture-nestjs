import { IsNumber, IsString } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { UpdateStockSaga } from '../sagas/UpdateStockSaga';

class Payload {

    @IsString()
    sku: string;

    @IsNumber()
    quantity: number;

}

export class UpdateStockCompensationEvent extends SagaEvent<Payload>{

    constructor(payload: Payload) {
        super(UpdateStockSaga.COMPENSATION, payload)
    }

}
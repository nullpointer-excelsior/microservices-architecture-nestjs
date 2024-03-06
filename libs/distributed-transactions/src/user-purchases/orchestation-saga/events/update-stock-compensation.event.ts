import { IsNumber, IsString } from 'class-validator';
import { SagaEvent } from '../../../sagas/saga.event';
import { UpdateStockSaga } from '../sagas/UpdateStockSaga';
import { EventProps } from './event.props';

class Payload {

    @IsString()
    sku: string;

    @IsNumber()
    quantity: number;

}

export class UpdateStockCompensationEvent extends SagaEvent<Payload>{

    constructor(props: EventProps<Payload>) {
        super({
            ...props,
            pattern: UpdateStockSaga.COMPENSATION
        })
    }

}
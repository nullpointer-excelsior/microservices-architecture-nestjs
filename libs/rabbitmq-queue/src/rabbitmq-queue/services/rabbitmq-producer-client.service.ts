import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { RabbitmqMessage } from "../model/RabbitmqMessage";
import { RABBITMQ_PRODUCER_CLIENT } from "../config/providers.tokens";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class RabbitmqProducerClient {

    constructor(@Inject(RABBITMQ_PRODUCER_CLIENT) private client: ClientProxy) { }

    emitTo<T>(pattern: string, payload: T): RabbitmqMessage<T> {
        const message: RabbitmqMessage<T> = {
            id: uuidv4(),
            pattern: pattern,
            timestamp: new Date(),
            data: payload
        }
        this.client.emit(pattern, message)
        return message
    }

}
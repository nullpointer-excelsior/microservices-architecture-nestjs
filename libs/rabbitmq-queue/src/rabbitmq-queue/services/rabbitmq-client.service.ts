import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { RabbitmqMessage } from "../model/RabbitmqMessage";
import { RABBITMQ_PRODUCER_CLIENT } from "../config/providers.tokens";
import short from 'short-uuid';


@Injectable()
export class RabbitmqClient {

    private static readonly uuidTranslator = short();

    constructor(@Inject(RABBITMQ_PRODUCER_CLIENT) private client: ClientProxy) { }

    emitTo<T>(pattern: string, data: T): RabbitmqMessage<T> {
        const message: RabbitmqMessage<T> = {
            id: RabbitmqClient.uuidTranslator.uuid(),
            pattern: pattern,
            timestamp: new Date(),
            data: data
        }
        this.client.emit(pattern, message)
        return message
    }

}
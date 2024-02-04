import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { RABBITMQ_PRODUCER_CLIENT } from "../config/constants";
import { IntegrationEvent } from "../events/integration.event";


@Injectable()
export class IntegrationEventBus {

    constructor(@Inject(RABBITMQ_PRODUCER_CLIENT) private client: ClientProxy) { }

    publish<T>(event: IntegrationEvent<T>): IntegrationEvent<T> {
        this.client.emit(event.name, event)
        return event
    }

}
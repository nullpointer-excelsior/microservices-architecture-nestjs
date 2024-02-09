import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { REDIS_PRODUCER_CLIENT } from "../config/constants";
import { IntegrationEvent } from "../events/integration.event";
import { IntegrationEventBus } from "../events/integration.eventbus";


@Injectable()
export class RedisEventBus extends IntegrationEventBus {

    constructor(@Inject(REDIS_PRODUCER_CLIENT) private client: ClientProxy) {
        super()
    }

    publish<T>(event: IntegrationEvent<T>): IntegrationEvent<T> {
        this.client.emit(event.name, event)
        return event
    }

}
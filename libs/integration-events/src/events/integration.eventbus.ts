import { IntegrationEvent } from "./integration.event";

export abstract class IntegrationEventBus {

    abstract publish<T>(event: IntegrationEvent<T>): IntegrationEvent<T>;

}
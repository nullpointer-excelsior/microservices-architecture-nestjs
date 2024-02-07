import { DomainEvent } from "./domain.event";

export abstract class DomainEventBus {
    abstract publish<T extends DomainEvent<any>>(event: T): void
}
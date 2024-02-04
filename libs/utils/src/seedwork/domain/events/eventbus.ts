import { DomainEvent } from "./domain.event";

export abstract class EventBus {
    abstract publish<T extends DomainEvent<any>>(event: T): void
}
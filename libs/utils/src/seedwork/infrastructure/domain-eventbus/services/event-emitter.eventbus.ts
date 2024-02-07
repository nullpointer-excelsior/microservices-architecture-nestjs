import { Injectable } from "@nestjs/common";
import { DomainEventBus } from "../../../domain/events/eventbus";
import { DomainEvent } from "../../../domain/events/domain.event";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class EventEmitterEventbus implements DomainEventBus {

    constructor(private eventEmitter: EventEmitter2) {}
   
    async publish<T extends DomainEvent<any>>(event: T) {
        this.eventEmitter.emit(event.name, event);
    }

}
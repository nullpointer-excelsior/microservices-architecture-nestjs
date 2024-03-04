import { Injectable, Logger } from "@nestjs/common";
import { DomainEventBus } from "../../../domain/events/eventbus";
import { DomainEvent } from "../../../domain/events/domain.event";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class EventEmitterEventbus implements DomainEventBus {

    private readonly logger = new Logger(EventEmitterEventbus.name);

    constructor(private eventEmitter: EventEmitter2) {}
   
    async publish<T extends DomainEvent<any>>(event: T) {
        this.logger.debug(`Publishing event: ${event.name}`);
        this.eventEmitter.emit(event.name, event);
    }

}
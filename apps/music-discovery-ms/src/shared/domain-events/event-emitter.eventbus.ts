import { Injectable } from "@nestjs/common";
import { EventBus } from "../../../../../libs/utils/src/seedwork/domain/events/eventbus";
import { DomainEvent } from "../../../../../libs/utils/src/seedwork/domain/events/domain.event";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class EventEmitterEventbus implements EventBus {

    constructor(private eventEmitter: EventEmitter2) {}
   
    async publish<T extends DomainEvent<any>>(event: T): Promise<void> {
        this.eventEmitter.emit(event.name, event);
    }

}
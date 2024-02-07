import { Module } from '@nestjs/common';
import { EventEmitterEventbus } from './services/event-emitter.eventbus';
import { DomainEventBus } from '../../domain/events/eventbus';
import { EventEmitterModule } from '@nestjs/event-emitter';

const providers = [
    EventEmitterEventbus,
    {
        provide: DomainEventBus,
        useClass: EventEmitterEventbus
    }
]

@Module({
    imports:[
        EventEmitterModule.forRoot({
            wildcard: true,
            delimiter: '.'
        })
    ],
    providers: [
        ...providers
    ],
    exports: [
        ...providers
    ]
})
export class DomainEventbusModule {}

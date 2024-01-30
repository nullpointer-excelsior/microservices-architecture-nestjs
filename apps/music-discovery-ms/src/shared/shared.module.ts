import { Global, Module } from '@nestjs/common';
import { EventEmitterEventbus } from './events/adapters/event-emitter.eventbus';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBus } from './events/ports/eventbus';

const providers = [
    EventEmitterEventbus,
    {
        provide: EventBus,
        useClass: EventEmitterEventbus
    }
]

@Global()
@Module({
    imports:[
        EventEmitterModule.forRoot()
    ],
    providers: [
        ...providers
    ],
    exports: [
        ...providers
    ]
})
export class SharedModule {}

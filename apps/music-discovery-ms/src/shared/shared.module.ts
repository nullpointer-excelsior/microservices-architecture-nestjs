import { Global, Module } from '@nestjs/common';
import { EventEmitterEventbus } from './domain-events/event-emitter.eventbus';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBus } from '../../../../libs/utils/src/seedwork/domain/events/eventbus';

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

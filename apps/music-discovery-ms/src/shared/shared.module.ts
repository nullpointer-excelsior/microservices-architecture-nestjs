import { Global, Module } from '@nestjs/common';
import { DomainEventbusModule } from '@lib/utils/seedwork';

@Global()
@Module({
    imports:[
        DomainEventbusModule
    ],
    exports: [
        DomainEventbusModule
    ]
})
export class SharedModule {}

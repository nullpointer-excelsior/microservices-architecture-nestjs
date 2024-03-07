import { Module } from '@nestjs/common';
import { CreateDeliverySagaController } from './infrastructure/sagas/create-delivery-saga.controller';
import { DeliveryService } from './application/delivery.service';
import { OrchestationSagaModule } from '@lib/distributed-transactions/user-purchases';

@Module({
    controllers:[
        CreateDeliverySagaController
    ],
    providers: [
        DeliveryService
    ],
    imports: [
        OrchestationSagaModule,
    ]
})
export class DeliveryModule {}

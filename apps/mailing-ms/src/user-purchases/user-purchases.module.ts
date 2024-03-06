import { Module } from '@nestjs/common';
import { CreateNotificationSagaController } from './infrastructure/sagas/create-notification-saga.controller';
import { OrchestationSagaModule } from '@lib/distributed-transactions/user-purchases';

@Module({
    controllers: [
        CreateNotificationSagaController
    ],
    imports: [
        OrchestationSagaModule
    ]
})
export class UserPurchasesModule {}

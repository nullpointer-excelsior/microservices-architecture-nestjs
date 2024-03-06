import { Saga } from '@lib/utils/sagas';
import { Module } from '@nestjs/common';
import { OrchestationSagaModule } from '../../../../libs/distributed-transactions/src/user-purchases/orchestation-saga/orchestation-saga.module';
import { PurchaseApplication } from './application/purchase.application';
import { PurchaseUseCases } from './application/usecases/purchase.usecases';
import { PurchaseRepository } from './domain/repositories/purchase.repository';
import { InMemoryPurchaseRepostiory } from './infrastructure/persistence/in-memory.purchase.repository';
import { PurchaseController } from './infrastructure/restful/controllers/purchase.controller';
import { SagaCoordinatorController } from './infrastructure/sagas/controllers/saga-coordinator.controller';
import { PurchaseService } from './domain/services/purchase.service';

const orderSagas = Saga.builder()
    .start({
        name: 'orders',
        transaction: 'create-order',
        ok: 'order-created',
        error: 'order-error',
        compensation: 'cancel-order'
    })
    .step({
        name: 'payments',
        startBy: 'order-created',
        transaction: 'create-payment',
        ok: 'payment-created',
        error: 'payment-error',
        compensation: 'cancel-payment'
    })
    .step({
        name: 'stock',
        startBy: 'payment-created',
        transaction: 'update-stock',
        ok: 'stock-updated',
        error: 'stock-error',
        compensation: 'cancel-stock'
    })
    .step({
        name: 'notification',
        startBy: 'stock-updated',
        transaction: 'send-notification',
        ok: 'notification-sent',
        error: 'notification-error',
        compensation: 'cancel-notification'
    })
    .build();

@Module({
    controllers: [
        PurchaseController,
        SagaCoordinatorController,
    ],
    providers: [
        PurchaseService,
        {
            provide: PurchaseApplication,
            useClass: PurchaseUseCases
        },
        {
            provide: PurchaseRepository,
            useClass: InMemoryPurchaseRepostiory
        }
    ],
    imports: [
        OrchestationSagaModule
    ]
})
export class PurchaseModule { }

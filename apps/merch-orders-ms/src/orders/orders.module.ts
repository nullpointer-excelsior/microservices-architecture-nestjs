import { Module } from '@nestjs/common';
import { OrderApplication } from './application/order.application';
import { OrderUseCases } from './application/usecases/order.use-cases';
import { OrderRepository } from './domain/repositories/order.repository';
import { InMemoryOrderRepository } from './infrastructure/persitence/in-memory.order.repository';
import { CreateOrderSagaController } from './infrastructure/sagas/create-order-saga.controller';
import { OrderController } from './infrastructure/restful/controllers/order.controller';
import { OrchestationSagaModule } from '@lib/distributed-transactions/user-purchases';

@Module({
    controllers: [
        OrderController,
        CreateOrderSagaController
    ],
    providers: [
        InMemoryOrderRepository,
        {
            provide: OrderRepository,
            useClass: InMemoryOrderRepository
        },
        OrderUseCases,
        {
            provide: OrderApplication,
            useClass: OrderUseCases
        }
    ],
    imports:[
        OrchestationSagaModule
    ]
})
export class OrdersModule {}

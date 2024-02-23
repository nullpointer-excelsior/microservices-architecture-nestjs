import { Module } from '@nestjs/common';
import { InMemoryOrderRepository } from './infrastructure/persitence/in-memory.order.repository';
import { OrderRepository } from './domain/repositories/order.repository';
import { OrderController } from './infrastructure/restful/controllers/order.controller';
import { OrderApplication } from './infrastructure/restful/services/order.application';
import { OrderUseCases } from './application/order.use-cases';

@Module({
    controllers: [
        OrderController
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
    ]
})
export class OrdersModule {}

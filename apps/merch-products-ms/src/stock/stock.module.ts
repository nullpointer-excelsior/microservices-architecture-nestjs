import { Module } from '@nestjs/common';
import { StockSagaController } from './infrastructure/sagas/stock-saga.controller';
import { OrchestationSagaModule } from '@lib/distributed-transactions/user-purchases';

@Module({
    controllers: [
        StockSagaController
    ],
    imports: [
        OrchestationSagaModule,
    ]
})
export class StockModule {}

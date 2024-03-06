import { Module } from '@nestjs/common';
import { StockSagaController } from './infrastructure/sagas/stock-saga.controller';
import { OrchestationSagaModule } from '@lib/distributed-transactions/user-purchases';
import { StockUseCases } from './application/stock.service';

@Module({
    controllers: [
        StockSagaController
    ],
    providers: [
        StockUseCases,
    ],
    imports: [
        OrchestationSagaModule,
    ]
})
export class StockModule {}

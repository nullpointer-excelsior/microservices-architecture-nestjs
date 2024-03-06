import { OrchestationSagaModule } from '@lib/distributed-transactions/user-purchases';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomainEventbusModule } from '@lib/utils/seedwork';
import { PaymentApplication } from './application/payment.application';
import { PaymentUseCases } from './application/usecases/payment.use-cases';
import { PaymentRepository } from './domain/repositories/payment.repository';
import { InMemoryPaymentRepository } from './infrastructure/persistence/in-memory.payment.repository';
import { PaymentController } from './infrastructure/restful/payment.controller';
import { CreatePaymentSagaController } from './infrastructure/sagas/create-payment-saga.controller';
import { BlacklistService } from './application/services/blacklist.service';

@Module({
    imports:[
        ConfigModule.forRoot(),
        OrchestationSagaModule,
    ],
    controllers:[
        PaymentController,
        CreatePaymentSagaController
    ],
    providers: [
        BlacklistService,
        {
            provide: PaymentRepository,
            useClass: InMemoryPaymentRepository
        },
        {
            provide: PaymentApplication,
            useClass: PaymentUseCases
        }
    ]
})
export class PaymentModule {}

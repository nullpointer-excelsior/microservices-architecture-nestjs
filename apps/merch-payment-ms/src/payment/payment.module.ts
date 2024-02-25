import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentApplication } from './application/payment.application';
import { PaymentController } from './infrastructure/restful/payment.controller';
import { PaymentUseCases } from './application/usecases/payment.use-cases';
import { PaymentRepository } from './domain/repositories/payment.repository';
import { InMemoryPaymentRepository } from './infrastructure/persistence/in-memory.payment.repository';

@Module({
    imports:[
        ConfigModule.forRoot()
    ],
    controllers:[
        PaymentController
    ],
    providers: [
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

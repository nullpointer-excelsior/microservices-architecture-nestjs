import { CreatePaymentCompensationEvent, CreatePaymentSaga, CreatePaymentTransactionEvent, SagaExecutorService } from "@lib/distributed-transactions/user-purchases";
import { SagaControllerPort } from "@lib/distributed-transactions/sagas";
import { EventPattern, RedisContext } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import { PaymentApplication } from "../../application/payment.application";

@Controller()
export class CreatePaymentSagaController extends SagaControllerPort<CreatePaymentTransactionEvent, CreatePaymentCompensationEvent>{
    
    private readonly logger = new Logger(CreatePaymentSagaController.name)

    constructor(
        private readonly sagas: SagaExecutorService,
        private readonly paymentApplication: PaymentApplication
    ) { super() }

    @EventPattern(CreatePaymentSaga.TRANSACTION)
    async onTransaction(payload: CreatePaymentTransactionEvent, context: RedisContext) {
        this.logger.log(`CreatingPaymentTransaction received with order-id: ${payload.payload.orderId}`);
        // TODO: Implement the logic to create the payment
        const payment = await this.paymentApplication.createPayment({
            orderId: payload.payload.orderId,
            customer: payload.payload.customer,
            totalAmount: 0
        })
        this.logger.log(`Payment created: ${payment.id}`);
    }

    @EventPattern(CreatePaymentSaga.COMPENSATION)
    onCompesation(payload: CreatePaymentCompensationEvent, context: RedisContext) {
        throw new Error("Method not implemented.");
    }

}
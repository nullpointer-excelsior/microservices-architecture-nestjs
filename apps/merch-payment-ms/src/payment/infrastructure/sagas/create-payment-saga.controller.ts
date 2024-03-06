import { CreatePaymentCompensationEvent, CreatePaymentErrorEvent, CreatePaymentOkEvent, CreatePaymentSaga, CreatePaymentTransactionEvent, SagaExecutorService } from "@lib/distributed-transactions/user-purchases";
import { SagaControllerPort } from "@lib/distributed-transactions/sagas";
import { EventPattern, RedisContext } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import { PaymentApplication } from "../../application/payment.application";
import { PaymentStatus } from "../../domain/model/payment-status.enum";

@Controller()
export class CreatePaymentSagaController extends SagaControllerPort<CreatePaymentTransactionEvent, CreatePaymentCompensationEvent>{
    
    private readonly logger = new Logger(CreatePaymentSagaController.name)

    constructor(
        private readonly sagas: SagaExecutorService,
        private readonly paymentApplication: PaymentApplication
    ) { super() }

    @EventPattern(CreatePaymentSaga.TRANSACTION)
    async onTransaction(event: CreatePaymentTransactionEvent, context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`CreatingPaymentTransaction received with order-id: ${event.payload.orderId}`);
        const payment = await this.paymentApplication.createPayment({
            orderId: event.payload.orderId,
            customer: event.payload.customer,
            totalAmount: 0
        })
        await new Promise(resolve => setTimeout(resolve, 1000));
        const paymentProcessed = await this.paymentApplication.processPayment(payment);
        if (paymentProcessed.status === PaymentStatus.APPROVED) {
            this.sagas.execute(new CreatePaymentOkEvent({
                transactionId: event.transactionId,
                payload: {
                    orderId: paymentProcessed.orderId,
                    paymentId: paymentProcessed.id,
                    status: paymentProcessed.status
                }
            }))
        } else {
            this.sagas.execute(new CreatePaymentErrorEvent({
                transactionId: event.transactionId,
                payload: {
                    orderId: paymentProcessed.orderId,
                    error: 'Payment declined',
                    reason: `Payment with status ${paymentProcessed.status}`
                }
            }))
        }
        

    }

    @EventPattern(CreatePaymentSaga.COMPENSATION)
    async onCompesation(event: CreatePaymentCompensationEvent, context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`CreatingPaymentCompensation received with order-id: ${event.payload.orderId}`);
        this.paymentApplication.updatePaymentStatus({
            id: event.payload.paymentId,
            status: PaymentStatus.CANCELED
        })

    }

}
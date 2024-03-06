import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RedisContext, RmqContext } from "@nestjs/microservices";
import { CreatePaymentTransactionEvent, CreateOrderOkEvent, CreateOrderErrorEvent, CreateOrderSaga, CreatePaymentSaga, CreatePaymentOkEvent, CreatePaymentErrorEvent, UpdateStockTransactionEvent, CreateOrderCompensationEvent, SagaExecutorService, UpdateStockSaga, UpdateStockOkEvent, CreateNotificationTransactionEvent } from "@lib/distributed-transactions/user-purchases";
import { PurchaseRepository } from "../../../domain/repositories/purchase.repository";

@Controller()
export class SagaCoordinatorController {

    private readonly logger = new Logger(SagaCoordinatorController.name)

    constructor(
        private readonly sagaExecutor: SagaExecutorService,
        private readonly purchaseRepository: PurchaseRepository
    ) { }

    @EventPattern(CreateOrderSaga.OK)
    async onOrderOk(@Payload() event: CreateOrderOkEvent, @Ctx() context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.log(`Order created: ${event.payload.order.id}`);
        const purchase = await this.findPurchaseByTransactionId(event.transactionId);
        purchase.order = event.payload.order;
        await this.purchaseRepository.save(purchase);
        this.sagaExecutor.execute(new CreatePaymentTransactionEvent({
            transactionId: event.transactionId,
            payload: {
                customer: event.payload.order.customer,
                orderId: event.payload.order.id,
            }
        }));
    }

    @EventPattern(CreateOrderSaga.ERROR)
    onOrderError(@Payload() event: CreateOrderErrorEvent, context: RmqContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.error(`Transaccion: ${event.transactionId} No pudo crear la orden reason: ${event.payload.reason}`);
    }

    @EventPattern(CreatePaymentSaga.OK)
    async onPaymentOk(event: CreatePaymentOkEvent, context: RmqContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.log(`Payment ok: ${event.payload.orderId} status: ${event.payload.status}`);
        const purchase = await this.findPurchaseByTransactionId(event.transactionId);
        purchase.order.lines.forEach(line => {
            this.sagaExecutor.execute(new UpdateStockTransactionEvent({
                transactionId: event.transactionId,
                payload: {
                    quantity: line.quantity,
                    sku: line.sku
                }
            }))
        })
    }

    @EventPattern(CreatePaymentSaga.ERROR)
    onPaymentError(event: CreatePaymentErrorEvent, context: RmqContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.error(`Transaccion: ${event.transactionId} No pudo crear el pago order-id: ${event.payload.orderId} reason: ${event.payload.reason}`);
        this.sagaExecutor.execute(new CreateOrderCompensationEvent({
            transactionId: event.transactionId,
            payload: {
                orderId: event.payload.orderId
            }
        }))
    }

    @EventPattern(UpdateStockSaga.OK)
    async onStockOk(event: UpdateStockOkEvent, context: RmqContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.log(`Stock updated: ${event.payload.sku} quantity: ${event.payload.quantity}`);
        const purchase = await this.findPurchaseByTransactionId(event.transactionId);
        this.sagaExecutor.execute(new CreateNotificationTransactionEvent({
            transactionId: event.transactionId,
            payload: {
                customer: purchase.order.customer,
                summary: `Order ${purchase.order.id} has been created your purchase is ready`
            }
        }))
    }

    private async findPurchaseByTransactionId(transactionId: string) {
        const purchase = await this.purchaseRepository.findByTransactionId(transactionId);
        if (!purchase) {
            throw new Error(`Purchase not found for transactionId: ${transactionId}`);
        }
        return purchase;
    }

}
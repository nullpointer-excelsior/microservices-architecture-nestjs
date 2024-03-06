import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RedisContext, RmqContext } from "@nestjs/microservices";
import { CreatePaymentTransactionEvent, CreateOrderOkEvent, CreateOrderErrorEvent, CreateOrderSaga, CreatePaymentSaga, CreatePaymentOkEvent, CreatePaymentErrorEvent, UpdateStockTransactionEvent, CreateOrderCompensationEvent, SagaExecutorService, UpdateStockSaga, UpdateStockOkEvent, CreateNotificationTransactionEvent, UpdateStockErrorEvent, CreatePaymentCompensationEvent } from "@lib/distributed-transactions/user-purchases";
import { PurchaseStatus } from "../../../domain/model/purchase-status";
import { PurchaseService } from "../../../domain/services/purchase.service";

@Controller()
export class SagaCoordinatorController {

    private readonly logger = new Logger(SagaCoordinatorController.name)

    constructor(
        private readonly sagaExecutor: SagaExecutorService,
        private readonly purchaseService: PurchaseService
    ) { }

    @EventPattern(CreateOrderSaga.OK)
    async onOrderOk(@Payload() event: CreateOrderOkEvent, @Ctx() context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`Order created: ${event.payload.order.id}`);
        const purchase = await this.purchaseService.findByTransactionId(event.transactionId);
        purchase.order = event.payload.order;
        await this.purchaseService.save(purchase);
        this.sagaExecutor.execute(new CreatePaymentTransactionEvent({
            transactionId: event.transactionId,
            payload: {
                customer: event.payload.order.customer,
                orderId: event.payload.order.id,
                total: event.payload.order.lines.map(line => line.quantity * line.unitPrice).reduce((a, b) => a + b, 0)
            }
        }));
    }

    @EventPattern(CreateOrderSaga.ERROR)
    onOrderError(@Payload() event: CreateOrderErrorEvent, context: RmqContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.error(`Transaccion: ${event.transactionId} No pudo crear la orden reason: ${event.payload.reason}`);
    }

    @EventPattern(CreatePaymentSaga.OK)
    async onPaymentOk(event: CreatePaymentOkEvent, context: RmqContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`Payment ok: ${event.payload.orderId} status: ${event.payload.status}`);
        const purchase = await this.purchaseService.findByTransactionId(event.transactionId);
        purchase.paymentId = event.payload.paymentId;
        await this.purchaseService.save(purchase);

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
    async onPaymentError(event: CreatePaymentErrorEvent, context: RmqContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.error(`Transaccion: ${event.transactionId} No pudo crear el pago order-id: ${event.payload.orderId} reason: ${event.payload.reason}`);
        this.sagaExecutor.execute(new CreateOrderCompensationEvent({
            transactionId: event.transactionId,
            payload: {
                orderId: event.payload.orderId
            }
        }))
        await this.purchaseService.updateStatus(event.transactionId, PurchaseStatus.CANCELLED);
    }

    @EventPattern(UpdateStockSaga.OK)
    async onStockOk(event: UpdateStockOkEvent, context: RmqContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`Stock updated: ${event.payload.sku} quantity: ${event.payload.quantity}`);
        const purchase = await this.purchaseService.findByTransactionId(event.transactionId);
        this.sagaExecutor.execute(new CreateNotificationTransactionEvent({
            transactionId: event.transactionId,
            payload: {
                customer: purchase.order.customer,
                summary: `Order ${purchase.order.id} has been created your purchase is ready`
            }
        }))
    }

    @EventPattern(UpdateStockSaga.ERROR)
    async onStockError(event: UpdateStockErrorEvent, context: RmqContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.error(`Stock update error: ${event.payload.sku} reason: ${event.payload.reason}`);
        const purchase = await this.purchaseService.findByTransactionId(event.transactionId);
        this.sagaExecutor.execute(new CreateOrderCompensationEvent({
            transactionId: event.transactionId,
            payload: {
                orderId: purchase.order.id
            }
        }))
        this.sagaExecutor.execute(new CreatePaymentCompensationEvent({
            transactionId: event.transactionId,
            payload: {
               orderId: purchase.order.id,
               paymentId: purchase.paymentId
            }
        }))
        await this.purchaseService.updateStatus(event.transactionId, PurchaseStatus.CANCELLED);
    }

}
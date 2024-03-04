import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RedisContext, RmqContext } from "@nestjs/microservices";
import { CreatePaymentTransactionEvent, CreateOrderOkEvent, CreateOrderErrorEvent, CreateOrderSaga, CreatePaymentSaga, CreatePaymentOkEvent, CreatePaymentErrorEvent } from "@lib/distributed-transactions/user-purchases";
import { SagaCoordinatorApplication } from "../../../application/saga-coordinator.application";
import { PurchaseRepository } from "../../../domain/repositories/purchase.repository";

@Controller()
export class OrderSagaController {

    private readonly logger = new Logger(OrderSagaController.name)

    constructor(
        private readonly sagaCoordinator: SagaCoordinatorApplication,
        private readonly purchaseRepository: PurchaseRepository
    ) { }
    
    @EventPattern(CreateOrderSaga.OK)
    async onOrderOk(@Payload() message: CreateOrderOkEvent, @Ctx() context: RedisContext) {
        this.logger.log(`Order created: ${message.payload.orderId}`);
        const purchase = await this.purchaseRepository.findByOrderId(message.payload.orderId);
        this.sagaCoordinator.startPaymentTransaction(new CreatePaymentTransactionEvent({
            orderId: message.payload.orderId,
            customer: purchase.customer,
        }));
    }

    @EventPattern(CreateOrderSaga.ERROR)
    onOrderError(@Payload() message: CreateOrderErrorEvent, context: RmqContext): void {
        this.logger.error(`No se pudo crear la orden order-id: ${message.payload.orderId} reason: ${message.payload.reason}`);
    }

    @EventPattern(CreatePaymentSaga.OK)
    onPaymentOk(message: CreatePaymentOkEvent, context: RmqContext): void {
        this.logger.log(`Payment ok: ${message.payload.orderId} status: ${message.payload.status}`);
    }

    onPaymentError(message: CreatePaymentErrorEvent, context: RmqContext): void {
        throw new Error("Method not implemented.");
    }
    // onStockOk(message: T, context: RmqContext): void {
    //     throw new Error("Method not implemented.");
    // }
    // onStockError(message: T, context: RmqContext): void {
    //     throw new Error("Method not implemented.");
    // }
    // onNotificationOk(message: T, context: RmqContext): void {
    //     throw new Error("Method not implemented.");
    // }
    // onNotificationError(message: T, context: RmqContext): void {
    //     throw new Error("Method not implemented.");
    // }

}
import { SagaControllerPort } from "@lib/distributed-transactions/sagas";
import { CreateOrderCompensationEvent, CreateOrderErrorEvent, CreateOrderOkEvent, CreateOrderSaga, CreateOrderTransactionEvent, SagaExecutorService } from "@lib/distributed-transactions/user-purchases";
import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RedisContext } from "@nestjs/microservices";
import { OrderApplication } from "../../application/order.application";
import { OrderStatus } from "../../domain/model/order-status.enum";

@Controller()
export class CreateOrderSagaController extends SagaControllerPort<CreateOrderTransactionEvent, CreateOrderCompensationEvent> {

    private readonly logger = new Logger(CreateOrderSagaController.name)

    constructor(
        private readonly orderApplication: OrderApplication,
        private readonly sagas: SagaExecutorService
    ) {
        super()
    }

    @EventPattern(CreateOrderSaga.TRANSACTION)
    async onTransaction(@Payload() event: CreateOrderTransactionEvent, @Ctx() context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.log(`CreatingOrderTransaction for transaction-id: ${event.transactionId}`);
        await this.orderApplication.createOrder(event.payload)
            .then(async order => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return order;
            })
            .then(order => {
                this.sagas.execute(new CreateOrderOkEvent({
                    transactionId: event.transactionId,
                    payload: {
                        order
                    }
                }));
            })
            .catch(err => {
                this.sagas.execute(new CreateOrderErrorEvent({
                    transactionId: event.transactionId,
                    payload: {
                        error: err.message,
                        reason: 'Error creating order'
                    }
                }))
            })

    }

    @EventPattern(CreateOrderSaga.COMPENSATION)
    async onCompesation(event: CreateOrderCompensationEvent, context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.log(`Order compensation received for order-id: ${event.payload.orderId}`);
        await this.orderApplication.updateOrderStatus({
            id: event.payload.orderId,
            status: OrderStatus.CANCELLED
        })
    }

}
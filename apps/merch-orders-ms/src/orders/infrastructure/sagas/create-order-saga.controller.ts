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
    async onTransaction(@Payload() payload: CreateOrderTransactionEvent, @Ctx() context: RedisContext) {
        this.logger.log(`CreatingOrderTransaction received with order-id: ${payload.payload.id}`);
        await this.orderApplication.createOrder(payload.payload)
            .then(async order => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return order;
            })
            .then(order => {
                this.sagas.execute(new CreateOrderOkEvent({
                    orderId: order.id,
                    createdAt: order.createdAt,
                    status: order.status
                }));
            })
            .catch(err => {
                this.sagas.execute(new CreateOrderErrorEvent({
                    orderId: payload.payload.id,
                    error: err.name,
                    reason: err.message
                }))
            })

    }

    @EventPattern(CreateOrderSaga.COMPENSATION)
    async onCompesation(payload: CreateOrderCompensationEvent, context: RedisContext) {
        this.logger.log(`Order compensation received for order-id: ${payload.payload.orderId}`);
        await this.orderApplication.updateOrderStatus({
            id: payload.payload.orderId,
            status: OrderStatus.CANCELLED
        })
    }

}
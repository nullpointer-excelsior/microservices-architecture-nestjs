import { Controller, Logger } from "@nestjs/common";
import { SagaControllerPort } from "@lib/distributed-transactions/sagas";
import { DeliveryErrorEvent, DeliveryOkEvent, DeliverySaga, DeliveryTransactionEvent, SagaExecutorService } from "@lib/distributed-transactions/user-purchases";
import { DeliveryCompensationEvent } from "@lib/distributed-transactions/user-purchases";
import { EventPattern, RedisContext } from "@nestjs/microservices";
import { DeliveryService } from "../../application/delivery.service";

@Controller()
export class CreateDeliverySagaController extends SagaControllerPort<DeliveryTransactionEvent, DeliveryCompensationEvent> {

    private readonly logger = new Logger(CreateDeliverySagaController.name)

    constructor(
        private readonly deliveryService: DeliveryService,
        private readonly sagas: SagaExecutorService
    ) {
        super();
    }

    @EventPattern(DeliverySaga.TRANSACTION)
    async onTransaction(event: DeliveryTransactionEvent, context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`Create delivery for order: ${event.payload.order.id}`);
        try {
            const delivery = await this.deliveryService.create({
                order: event.payload.order
            });
            this.sagas.execute(new DeliveryOkEvent({
                transactionId: event.transactionId,
                payload: {
                    delivery
                }
            }));
        } catch (error) {
            this.logger.error(error.message);
            this.sagas.execute(new DeliveryErrorEvent({
                transactionId: event.transactionId,
                payload: {
                    error: 'Error creating delivery',
                    reason: error.message
                }
            }));
        }
    }

    @EventPattern(DeliverySaga.COMPENSATION)
    onCompesation(event: DeliveryCompensationEvent, context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`Compensating delivery for order: ${event.payload.deliveryId}`);
    }

}
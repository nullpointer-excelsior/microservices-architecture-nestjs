import { CreatePaymentOkEvent, SagaExecutorService } from "@lib/distributed-transactions/user-purchases"
import { Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { PaymentStatusUpdatedEvent } from "../../domain/events/payment-status-updated.event"
import { PaymentStatus } from "../../domain/model/payment-status.enum"

@Injectable()
export class DomainEventListener {

    private readonly logger = new Logger(DomainEventListener.name)

    constructor(private readonly sagaExecutor: SagaExecutorService) {}
    
    @OnEvent(PaymentStatusUpdatedEvent.NAME)
    async onPaymentStatusUpdated(event: PaymentStatusUpdatedEvent) {
        this.logger.debug(`Domain event: ${PaymentStatusUpdatedEvent.NAME} for orderId: ${event.payload.orderId}`)
        if (event.payload.status === PaymentStatus.APPROVED) {
            this.sagaExecutor.execute(new CreatePaymentOkEvent({
                orderId: event.payload.orderId,
                status: event.payload.status
            }))
        }
    }

}
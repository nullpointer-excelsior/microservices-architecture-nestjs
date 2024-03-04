import { CreateOrderTransactionEvent, CreatePaymentTransactionEvent, SagaExecutorService } from "@lib/distributed-transactions/user-purchases";
import { Injectable, Logger } from "@nestjs/common";
import { SagaCoordinatorApplication } from "../saga-coordinator.application";

@Injectable()
export class SagaCoordinatorService extends SagaCoordinatorApplication {
    
    private readonly logger = new Logger(SagaCoordinatorService.name)

    constructor(private readonly sagas: SagaExecutorService) {
        super();
    }

    startOrderTransaction(event: CreateOrderTransactionEvent) {
        this.logger.log(`CreateOrderSaga for order-id: ${event.payload.id} CREATED`);
        this.logger.log(`Starting create-order-transaction for order-id: ${event.payload.id}`);
        this.sagas.execute(event);
    }

    startPaymentTransaction(event: CreatePaymentTransactionEvent) {
        this.logger.log(`Starting create-payment-transaction for order-id: ${event.payload.orderId}`);
        this.sagas.execute(event);
    }
}
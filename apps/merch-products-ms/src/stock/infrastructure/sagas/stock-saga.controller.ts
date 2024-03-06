import { Controller, Logger } from "@nestjs/common";
import { SagaControllerPort } from "@lib/distributed-transactions/sagas";
import { SagaExecutorService, UpdateStockCompensationEvent, UpdateStockErrorEvent, UpdateStockOkEvent, UpdateStockSaga, UpdateStockTransactionEvent } from "@lib/distributed-transactions/user-purchases";
import { EventPattern, RedisContext } from "@nestjs/microservices";
import { StockUseCases } from "../../application/stock.service";

@Controller()
export class StockSagaController extends SagaControllerPort<UpdateStockTransactionEvent, UpdateStockCompensationEvent> {

    private readonly logger = new Logger(StockSagaController.name)

    constructor(
        private readonly sagas: SagaExecutorService,
        private readonly stock: StockUseCases
    ) {
        super();
    }

    @EventPattern(UpdateStockSaga.TRANSACTION)
    async onTransaction(event: UpdateStockTransactionEvent, context: RedisContext) {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`Update stock for sku: ${event.payload.sku} quantity: ${event.payload.quantity}`);
        try {
            await this.stock.updateStock(event.payload.sku, event.payload.quantity);
            this.sagas.execute(new UpdateStockOkEvent({
                transactionId: event.transactionId,
                payload: {
                    sku: event.payload.sku,
                    quantity: event.payload.quantity
                }
            }));
        } catch (error) {
            this.logger.error(error.message);
            this.sagas.execute(new UpdateStockErrorEvent({
                transactionId: event.transactionId,
                payload: {
                    sku: event.payload.sku,
                    error: 'Error updating stock',
                    reason: error.message
                }
            }));
        }

    }

    @EventPattern(UpdateStockSaga.COMPENSATION)
    onCompesation(event: UpdateStockCompensationEvent, context: RedisContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        throw new Error("Method not implemented.");
    }

}
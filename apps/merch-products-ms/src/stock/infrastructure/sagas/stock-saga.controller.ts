import { Controller, Logger } from "@nestjs/common";
import { SagaControllerPort } from "@lib/distributed-transactions/sagas";
import { SagaExecutorService, UpdateStockErrorEvent, UpdateStockOkEvent, UpdateStockSaga, UpdateStockTransactionEvent } from "@lib/distributed-transactions/user-purchases";
import { EventPattern, RedisContext } from "@nestjs/microservices";

@Controller()
export class StockSagaController extends SagaControllerPort<UpdateStockTransactionEvent, UpdateStockErrorEvent> {
    
    private readonly logger = new Logger(StockSagaController.name)

    constructor(private readonly sagas: SagaExecutorService) {
        super();
    }

    @EventPattern(UpdateStockSaga.TRANSACTION)
    onTransaction(event: UpdateStockTransactionEvent, context: RedisContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.log(`Update stock for sku: ${event.payload.sku} quantity: ${event.payload.quantity}`);
        this.sagas.execute(new UpdateStockOkEvent({
            transactionId: event.transactionId,
            payload: {
                sku: event.payload.sku,
                quantity: 100-event.payload.quantity
            }
        }));
    }

    @EventPattern(UpdateStockSaga.COMPENSATION)
    onCompesation(event: UpdateStockErrorEvent, context: RedisContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        throw new Error("Method not implemented.");
    }

}
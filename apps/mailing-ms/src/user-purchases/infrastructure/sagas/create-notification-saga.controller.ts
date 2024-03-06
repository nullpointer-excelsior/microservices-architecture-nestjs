import { Controller, Logger } from "@nestjs/common";
import { SagaControllerPort } from "@lib/distributed-transactions/sagas";
import { CreateNotificationErrorEvent, CreateNotificationTransactionEvent } from "@lib/distributed-transactions/user-purchases";
import { EventPattern, Payload, RedisContext } from "@nestjs/microservices";
import { CreateNotificationSaga } from "@lib/distributed-transactions/user-purchases/";

@Controller()
export class CreateNotificationSagaController extends SagaControllerPort<CreateNotificationTransactionEvent, CreateNotificationErrorEvent> {

    private readonly logger = new Logger(CreateNotificationSagaController.name)
    
    @EventPattern(CreateNotificationSaga.TRANSACTION)
    onTransaction(@Payload() event: CreateNotificationTransactionEvent, context: RedisContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.log(`Sending email notification to: ${event.payload.customer.email}`);
    }

    @EventPattern(CreateNotificationSaga.ERROR)
    onCompesation(@Payload() event: CreateNotificationErrorEvent, context: RedisContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        throw new Error("Method not implemented.");
    }
 
}
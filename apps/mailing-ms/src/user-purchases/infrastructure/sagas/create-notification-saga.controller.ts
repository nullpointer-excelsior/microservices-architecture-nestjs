import { CreateNotificationTransactionEvent } from "@lib/distributed-transactions/user-purchases";
import { CreateNotificationSaga } from "@lib/distributed-transactions/user-purchases/";
import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload, RedisContext } from "@nestjs/microservices";

@Controller()
export class CreateNotificationSagaController {

    private readonly logger = new Logger(CreateNotificationSagaController.name)
    
    @EventPattern(CreateNotificationSaga.TRANSACTION)
    onTransaction(@Payload() event: CreateNotificationTransactionEvent, context: RedisContext): void {
        this.logger.debug(`Received Event(pattern=${event.pattern}, transactionId=${event.transactionId})`)
        this.logger.debug('Event-payload', event.payload)
        this.logger.log(`Sending email notification to: ${event.payload.customer.email}`);
    }
 
}
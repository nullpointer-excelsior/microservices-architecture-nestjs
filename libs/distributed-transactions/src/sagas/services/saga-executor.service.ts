import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { USER_PURCHASES_CLIENT } from "../../user-purchases/orchestation-saga/constants";
import { SagaEvent } from "../saga.event";


@Injectable()
export class SagaExecutorService {

    private readonly logger = new Logger(SagaExecutorService.name)

    constructor(@Inject(USER_PURCHASES_CLIENT) private client: ClientProxy) { }

    execute<T = any>(event: SagaEvent<T>) {
        this.logger.debug(`Sending saga-event-id: ${event.id} to pattern: ${event.pattern} `)
        this.client.emit(event.pattern, event)
    }

}
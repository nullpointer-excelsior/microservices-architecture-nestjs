import { RmqContext } from "@nestjs/microservices";

export abstract class SagaControllerApplication {
    abstract onOrderOk<T = any>(message: T, context: RmqContext): void
    abstract onOrderError<T = any>(message: T, context: RmqContext): void
    abstract onPaymentOk<T = any>(message: T, context: RmqContext): void
    abstract onPaymentError<T = any>(message: T, context: RmqContext): void
    abstract onStockOk<T = any>(message: T, context: RmqContext): void
    abstract onStockError<T = any>(message: T, context: RmqContext): void
    abstract onNotificationOk<T = any>(message: T, context: RmqContext): void
    abstract onNotificationError<T = any>(message: T, context: RmqContext): void
}
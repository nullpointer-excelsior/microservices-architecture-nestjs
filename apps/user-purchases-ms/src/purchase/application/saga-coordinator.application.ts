import { CreateOrderTransactionEvent, CreatePaymentTransactionEvent } from "@lib/distributed-transactions/user-purchases";

export abstract class SagaCoordinatorApplication {
    abstract startOrderTransaction(event: CreateOrderTransactionEvent): void
    abstract startPaymentTransaction(event: CreatePaymentTransactionEvent): void
}
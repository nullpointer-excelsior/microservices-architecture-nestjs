import { RedisContext } from "@nestjs/microservices";

export abstract class SagaControllerPort<T, C> {
    abstract onTransaction(payload: T, context: RedisContext): void;
    abstract onCompesation(payload: C, context: RedisContext): void;
}
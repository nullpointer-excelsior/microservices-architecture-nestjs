import { Transport } from "@nestjs/microservices"
import { INTEGRATION_EVENT_QUEUE } from "../config/constants"

export function getRabbitMQOptions() {
    const user = process.env.RABBITMQ_USER
    const password = process.env.RABBITMQ_PASS
    const host = process.env.RABBITMQ_HOST
    const amqpurl = `amqp://${user}:${password}@${host}:5672`

    return {
        transport: Transport.RMQ,
        options: {
            urls: [
                amqpurl
            ],
            queue: INTEGRATION_EVENT_QUEUE,
            queueOptions: {
                durable: false
            },
        }
    }

}
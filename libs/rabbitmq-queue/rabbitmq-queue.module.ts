import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBITMQ_PRODUCER_CLIENT } from './src/rabbitmq-queue/config/providers.tokens';
import { RabbitmqClient } from './src/rabbitmq-queue/services/rabbitmq-client.service';

const QUEUE_NAME = 'spotify_clone_queue'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: RABBITMQ_PRODUCER_CLIENT,
                imports: [
                    ConfigModule.forRoot()
                ],
                useFactory: (config: ConfigService) => {
                    const user = config.get('RABBITMQ_USER')
                    const password = config.get('RABBITMQ_PASS')
                    const host = config.get('RABBITMQ_HOST')
                    const amqp = `amqp://${user}:${password}@${host}:5672`
                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [
                                amqp
                            ],
                            queue: QUEUE_NAME,
                            queueOptions: {
                                durable: false,
                            },
                        },
                    }
                },
                inject: [
                    ConfigService
                ]
            }
        ]),
    ],
    exports: [
        RabbitmqClient,
    ],
    providers: [
        RabbitmqClient
    ]
})
export class RabbitmqQueueModule {

    static getMicroserviceOptions(): any {

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
                queue: QUEUE_NAME,
                queueOptions: {
                    durable: false
                },
            }
        }

    }

}

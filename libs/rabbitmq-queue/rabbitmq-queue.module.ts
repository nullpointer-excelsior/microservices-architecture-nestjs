import { DynamicModule, Logger } from '@nestjs/common';
import { ClientProviderOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqProducerClient } from './src/rabbitmq-queue/services/rabbitmq-producer-client.service';
import { RABBITMQ_PRODUCER_CLIENT } from './src/rabbitmq-queue/config/providers.tokens';
import { createDeadLetter } from './src/rabbitmq-queue/services/create-dead-letter';
import { RabbitmqQueueConfigFactory } from './src/rabbitmq-queue/config/rabbitmq-queue.config';


export interface RabbitmqQueueModuleOptions {
    credentials: {
        host: string;
        port: number;
        vhost: string;
        user: string;
        password: string;
    }
    queue: {
        name: string;
        deadLetter: {
            exchange: string;
            patterns: string[];
        }
    }
}

export class RabbitmqQueueModule {

    static async createWorkerMicroserviceOptions(options: RabbitmqQueueModuleOptions): Promise<ClientProviderOptions> {

        const config = RabbitmqQueueConfigFactory(options)
        const { deadLetter } = config

        const deadLetterOptions = {
            amqpurl: config.amqpurl,
            deadLetterQueue: deadLetter.queue,
            exchange: deadLetter.exchange,
            patterns: deadLetter.patterns
        }
        const deadLetterResult = await createDeadLetter(deadLetterOptions)
        Logger.log(deadLetterResult)

        const provider: ClientProviderOptions = {
            transport: Transport.RMQ,
            name: 'worker-queue',
            options: {
                urls: [config.amqpurl],
                queue: config.queue,
                noAck: false,
                queueOptions: {
                    durable: true,
                    deadLetterExchange: deadLetter.exchange,
                    requeue: false,
                },
            },
        }

        return Promise.resolve(provider)

    }

    static async createRecoveryMicroserviceOptions(options: RabbitmqQueueModuleOptions): Promise<ClientProviderOptions> {

        const config = RabbitmqQueueConfigFactory(options)
        const { deadLetter } = config

        const provider: ClientProviderOptions = {
            transport: Transport.RMQ,
            name: 'recovery-queue',
            options: {
                urls: [config.amqpurl],
                queue: `${deadLetter.queue}`,
                queueOptions: {
                    durable: true
                },
            },
        }

        return Promise.resolve(provider)

    }

    static register(options: RabbitmqQueueModuleOptions): DynamicModule {
        const config = RabbitmqQueueConfigFactory(options)
        const { deadLetter } = config
        return {
            module: RabbitmqQueueModule,
            imports: [
                ClientsModule.register([
                    {
                        name: RABBITMQ_PRODUCER_CLIENT,
                        transport: Transport.RMQ,
                        options: {
                            urls: [
                                config.amqpurl
                            ],
                            queue: config.queue,
                            queueOptions: {
                                durable: true,
                                deadLetterExchange: deadLetter.exchange
                            },
                        },
                    }
                ]),
            ],
            exports: [
                RabbitmqProducerClient,
            ],
            providers: [
                RabbitmqProducerClient
            ]
        }
    }

}

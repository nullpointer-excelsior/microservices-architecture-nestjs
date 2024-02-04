import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INTEGRATION_EVENT_QUEUE, RABBITMQ_PRODUCER_CLIENT } from './config/constants';
import { IntegrationEventBus } from './services/integration.eventbus';

@Module({
  providers: [
    IntegrationEventBus
  ],
  exports: [
    IntegrationEventBus
  ],
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
              queue: INTEGRATION_EVENT_QUEUE,
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
    ])
  ]

})
export class IntegrationEventsModule { }

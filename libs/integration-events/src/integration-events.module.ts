import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_PRODUCER_CLIENT } from './config/constants';
import { IntegrationEventBus } from './events/integration.eventbus';
import { RedisEventBus } from './services/redis.eventbus';

const IntegrationEventbusProvider = {
  provide: IntegrationEventBus,
  useExisting: RedisEventBus
}
@Module({
  providers: [
    RedisEventBus,
    IntegrationEventbusProvider
  ],
  exports: [
    IntegrationEventbusProvider
  ],
  imports: [
    ClientsModule.registerAsync([
      {
        name: REDIS_PRODUCER_CLIENT,
        imports: [
          ConfigModule.forRoot()
        ],
        useFactory: (config: ConfigService) => {
          const host = config.get('REDIS_HOST')
          const port = config.get('REDIS_PORT')
          const password = config.get('REDIS_PASS') 
          return {
            transport: Transport.REDIS,
            options: {
              host,
              port,
              password
            }
          }
        },
        inject: [
          ConfigService
        ]
      },
    ]),
  ]

})
export class IntegrationEventsModule { }

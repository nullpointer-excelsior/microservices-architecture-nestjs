import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SagaExecutorService } from '../../sagas/services/saga-executor.service';
import { USER_PURCHASES_CLIENT } from './constants';

@Module({
    providers: [
        SagaExecutorService,
    ],
    exports:[
        SagaExecutorService,
    ],
    imports:[
        ClientsModule.registerAsync([
            {
                name: USER_PURCHASES_CLIENT,
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
export class OrchestationSagaModule {}

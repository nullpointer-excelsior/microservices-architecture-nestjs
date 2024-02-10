import { HttpClientModule } from '@lib/utils/http-client';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RadioAPI } from './api/radio.api';

@Module({
  imports: [
    HttpClientModule.registerAsync({
      useFactory(config: ConfigService) {
        return {
          baseURL: config.get('MUSIC_DISCOVERY_API')
        }
      },
      inject: [
        ConfigService
      ],
      imports: [
        ConfigModule.forRoot()
      ]
    })
  ],
  providers: [
    RadioAPI
  ],
  exports: [
    RadioAPI
  ],
})
export class MusicDiscoveryApiModule {

}

import { HttpClientModule } from '@lib/utils/http-client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RadioAPI } from './api/radio.api';

type Options = {
  url: string
}

type AsyncOptions = {
  useFactory(...args: any[]): Options
  inject?: any[],
  imports?: any[]
}

@Module({})
export class MusicDiscoveryApiModule {

  static forAsyncRoot(options: AsyncOptions) {
    return {
      module: MusicDiscoveryApiModule,
      imports: [
        ConfigModule,
        HttpClientModule.registerAsync({
          useFactory(...args: any[]) {
            const config = options.useFactory(...args)
            return {
              baseURL: config.url
            }
          },
          inject: options.inject || [],
          imports: options.imports || []
        })
      ],
      providers: [
        RadioAPI
      ],
      exports: [
        RadioAPI
      ],
    }
  }
}

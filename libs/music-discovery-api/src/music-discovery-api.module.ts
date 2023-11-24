import { Module } from '@nestjs/common';
import { RadioAPI } from './api/radio.api';
import { MusicDiscoveryCLient } from './api/client/music-discovery.client';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

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
  static forRoot({ url }: Options) {
    return {
      module: MusicDiscoveryApiModule,
      imports: [
        ConfigModule,
        HttpModule.register({
          baseURL: url
        })
      ],
      providers: [
        MusicDiscoveryCLient,
        RadioAPI
      ],
      exports: [
        RadioAPI
      ],
    }
  }

  static forAsyncRoot(options: AsyncOptions) {
    return {
      module: MusicDiscoveryApiModule,
      imports: [
        ConfigModule,
        HttpModule.registerAsync({
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
        MusicDiscoveryCLient,
        RadioAPI
      ],
      exports: [
        RadioAPI
      ],
    }
  }
}

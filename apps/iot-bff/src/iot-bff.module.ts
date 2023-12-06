import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MusicLibraryApiModule } from '@lib/music-library-api';
import { MusicLibraryService } from './grpc/services/music-library.service';
import { CatalogController } from './grpc/controllers/catalog.controller';
import { MusicLibraryGrpcModule } from '../../../libs/music-library-grpc/src';

@Module({
  imports: [
    MusicLibraryApiModule.forAsyncRoot({
      useFactory(config: ConfigService) {
        return {
          url: config.get('MOBILE_BFF_MUSIC_LIBRARY_API')
        }
      },
      imports: [
        ConfigModule.forRoot()
      ],
      inject: [
        ConfigService
      ]
    }),
    MusicLibraryGrpcModule
  ],
  providers: [
    MusicLibraryService
  ],
  controllers: [
    CatalogController
  ]
})
export class IotBffModule { }

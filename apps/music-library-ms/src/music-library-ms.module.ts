import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MusicCatalogModule } from './music-catalog/music-catalog.module';
import { MusicLibraryModule } from './music-library/music-library.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [
    MusicLibraryModule,
    MusicCatalogModule,
    DatabaseModule.forRootAsync({
      useFactory(config: ConfigService) {
          return {
              host: config.get('MUSIC_LIBRARY_MS_DATABASE_HOST'),
              port: +config.get('MUSIC_LIBRARY_MS_DATABASE_PORT'),
              username: config.get('MUSIC_LIBRARY_MS_DATABASE_USER'),
              password: config.get('MUSIC_LIBRARY_MS_DATABASE_PASS'),
              database: config.get('MUSIC_LIBRARY_MS_DATABASE_NAME'),
              sync: false
          }
      },
      inject: [
          ConfigService
      ],
      imports: [
          ConfigModule
      ]
  }),
  ],
})
export class MusicLibraryMsModule { }

import { Module } from '@nestjs/common';
import { MusicLibraryModule } from './music-library/music-library.module';
import { MusicCatalogModule } from './music-catalog/music-catalog.module';
import { DatabaseModule } from './shared/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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

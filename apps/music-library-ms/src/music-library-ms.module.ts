import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SongUseCases } from './application/song.use-cases';
import { SongController } from './infrastructure/api/song.controller';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { SongRepository } from './infrastructure/persistence/song.repository';
import { ArtistController } from './infrastructure/api/artist.controller';
import { ArtistUseCases } from './application/artist.use-cases';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PersistenceModule.register({
      host: process.env.MUSIC_LIBRARY_MS_DATABASE_HOST,
      port: 5432,
      username: process.env.MUSIC_LIBRARY_MS_DATABASE_USER,
      password: process.env.MUSIC_LIBRARY_MS_DATABASE_PASS,
      database: process.env.MUSIC_LIBRARY_MS_DATABASE_NAME,
    })
  ],
  controllers: [
    SongController,
    ArtistController
  ],
  providers: [
    SongUseCases,
    ArtistUseCases,
    SongRepository
  ]
})
export class MusicLibraryMsModule {}

import { Module } from '@nestjs/common';
import { SongController } from './infrastructure/queue/controllers/song.controller';
import { PlayListUseCases } from '../../player-ms/src/player/application/playlists.use-cases';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GenreApi } from './infrastructure/music-library-api/genre.api';
import { RadioApi } from './infrastructure/music-library-api/radio.api';
import { RadioUseCase } from './application/use-cases/radio.use-case';
import { MusicLibraryApiModule } from '../../../libs/music-library-api/src';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MusicLibraryApiModule
  ],
  controllers: [
    SongController
  ],
  providers:[
    PlayListUseCases,
    RadioUseCase,
    GenreApi,
    RadioApi
  ]
})
export class MusicDiscoveryMsModule {}

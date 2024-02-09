import { HttpClientModule } from '@lib/utils/http-client';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlbumAPI } from './api/album.api';
import { ArtistAPI } from './api/artist.api';
import { GenreAPI } from './api/genre.api';
import { SongAPI } from './api/song.api';

@Module({
  providers: [
    AlbumAPI,
    ArtistAPI,
    GenreAPI,
    SongAPI
  ],
  exports: [
    AlbumAPI,
    ArtistAPI,
    GenreAPI,
    SongAPI
  ],
  imports:[
    HttpClientModule.registerAsync({
      useFactory(config: ConfigService) {
        return {
          baseURL: config.get('MUSIC_LIBRARY_API')
        }
      },
      inject: [
        ConfigService
      ],
      imports: [
        ConfigModule
      ]
    })
  ]
})
export class MusicLibraryApiModule {

}

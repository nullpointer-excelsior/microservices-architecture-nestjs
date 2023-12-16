import { HttpClientModule } from '@lib/utils/http-client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlbumAPI } from './api/album.api';
import { ArtistAPI } from './api/artist.api';
import { GenreAPI } from './api/genre.api';
import { SongAPI } from './api/song.api';

type Options = {
  url: string
}

type AsyncOptions = {
  useFactory(...args: any[]): Options
  inject?: any[],
  imports?: any[]
}


@Module({})
export class MusicLibraryApiModule {

  static forAsyncRoot(options: AsyncOptions) {
    return {
      module: MusicLibraryApiModule,
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
    }
  }
}

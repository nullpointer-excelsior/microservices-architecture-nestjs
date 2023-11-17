import { Module } from '@nestjs/common';
import { AlbumAPI } from './api/album.api';
import { ArtistAPI } from './api/artist.api';
import { GenreAPI } from './api/genre.api';
import { SongAPI } from './api/song.api';
import { ConfigModule } from '@nestjs/config';
import { MusicLibraryCLient } from './api/client/music-library.client';
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
export class MusicLibraryApiModule {

  static forRoot({ url }: Options) {
    return {
      module: MusicLibraryApiModule,
      imports: [
        ConfigModule,
        HttpModule.register({
          baseURL: url
        })
      ],
      providers: [
        MusicLibraryCLient,
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

  static forAsyncRoot(options: AsyncOptions) {
    return {
      module: MusicLibraryApiModule,
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
        MusicLibraryCLient,
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

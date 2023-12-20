import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AlbumResolver } from './music-catalog/graphql/resolvers/album.resolver';
import { ArtistResolver } from './music-catalog/graphql/resolvers/artist.resolver';
import { GenreResolver } from './music-catalog/graphql/resolvers/genre.resolver';
import { SongResolver } from './music-catalog/graphql/resolvers/song.resolver';
import { MusicLibraryApiModule } from '@lib/music-library-api';
import { MusicDiscoveryApiModule } from '@lib/music-discovery-api';
import { RadioResolver } from './music-catalog/graphql/resolvers/radio.resolver';
import { MusciPlayerModule } from './music-player/music-player.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/mobile-bff/schema.gql'),
    }),
    MusicLibraryApiModule.forAsyncRoot({
      useFactory(config: ConfigService) {
        return {
          url: config.get('MOBILE_BFF_MUSIC_LIBRARY_API')
        }
      },
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    MusicDiscoveryApiModule.forAsyncRoot({
      useFactory(config: ConfigService) {
        return {
          url: config.get('MOBILE_BFF_MUSIC_DISCOVERY_API')
        }
      },
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    MusciPlayerModule
  ],
  providers: [
    ArtistResolver,
    AlbumResolver,
    GenreResolver,
    SongResolver,
    RadioResolver,
  ],
})
export class MobileBffModule { }

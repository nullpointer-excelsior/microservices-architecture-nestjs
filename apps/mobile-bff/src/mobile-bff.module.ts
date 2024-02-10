import { MusicDiscoveryApiModule } from '@lib/music-discovery-api';
import { MusicLibraryApiModule } from '@lib/music-library-api';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { MusicLibraryGrpcModule } from '../../../libs/music-library-grpc/src';
import { AlbumResolver } from './music-catalog/graphql/resolvers/album.resolver';
import { ArtistResolver } from './music-catalog/graphql/resolvers/artist.resolver';
import { GenreResolver } from './music-catalog/graphql/resolvers/genre.resolver';
import { RadioResolver } from './music-catalog/graphql/resolvers/radio.resolver';
import { SongResolver } from './music-catalog/graphql/resolvers/song.resolver';
import { MusciPlayerModule } from './music-player/music-player.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/mobile-bff/schema.gql'),
    }),
    MusicLibraryGrpcModule,
    MusicLibraryApiModule,
    MusicDiscoveryApiModule,
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

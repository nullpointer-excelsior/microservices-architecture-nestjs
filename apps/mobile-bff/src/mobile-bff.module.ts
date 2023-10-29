import { Module } from '@nestjs/common';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AlbumResolver } from './music-discovery/graphql/resolvers/album.resolver';
import { ArtistResolver } from './music-discovery/graphql/resolvers/artist.resolver';
import { GenreResolver } from './music-discovery/graphql/resolvers/genre.resolver';
import { AlbumService } from './music-discovery/music-library-api/services/album.service';
import { ArtistService } from './music-discovery/music-library-api/services/artist.service';
import { GenreService } from './music-discovery/music-library-api/services/genre.service';
import { MusicLibraryCLient } from './music-discovery/shared/client/music-library.client';
import { SongService } from './music-discovery/music-library-api/services/song.service';
import { RadioResolver } from './music-discovery/graphql/resolvers/radio.resolver';
import { RadioService } from './music-discovery/music-library-api/services/radio.service';
import { PlayerCLient } from './music-discovery/shared/client/player.client';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/mobile-bff/schema.gql'),
    }),
    HttpModule
  ],
  providers: [
      ArtistResolver,
      AlbumResolver,
      GenreResolver,
      RadioResolver,
      ArtistService,
      AlbumService,
      SongService,
      GenreService,
      RadioService,
      MusicLibraryCLient,
      PlayerCLient
  ]
})
export class MobileBffModule {}

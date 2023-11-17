import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AlbumResolver } from './music-catalog/graphql/resolvers/album.resolver';
import { ArtistResolver } from './music-catalog/graphql/resolvers/artist.resolver';
import { GenreResolver } from './music-catalog/graphql/resolvers/genre.resolver';
import { RadioResolver } from './music-catalog/graphql/resolvers/radio.resolver';
import { MusicLibraryApiModule } from '../../../libs/music-library-api/src';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/mobile-bff/schema.gql'),
    }),
    MusicLibraryApiModule.forRoot('http://localhost:3011')
  ],
  providers: [
      ArtistResolver,
      AlbumResolver,
      GenreResolver,
      RadioResolver
  ]
})
export class MobileBffModule {}

import { Module } from '@nestjs/common';
import { MusicLibraryGrpcModule } from '../../../../libs/music-library-grpc/src';
import { CatalogUseCases } from './application/catalog.use-cases';
import { AlbumRepository } from './domain/repositories/album.repository';
import { ArtistRepository } from './domain/repositories/artist.repository';
import { GenreRepository } from './domain/repositories/genre.repository';
import { SongRepository } from './domain/repositories/song.repository';
import { CatalogController } from './infrastructure/grpc/catalog.controller';
import { PostgresAlbumRepository } from './infrastructure/postgres/postgres.album.repository';
import { PostgresArtistRepository } from './infrastructure/postgres/postgres.artist.repository';
import { PostgresGenreRepository } from './infrastructure/postgres/postgres.genre.repository';
import { PostgresSongRepository } from './infrastructure/postgres/postgres.song.repository';

@Module({
    controllers: [
        CatalogController
    ],
    providers: [
        CatalogUseCases,
        PostgresArtistRepository,
        PostgresAlbumRepository,
        PostgresGenreRepository,
        PostgresSongRepository,
        {
            provide: ArtistRepository,
            useExisting: PostgresArtistRepository
        },
        {
            provide: AlbumRepository,
            useExisting: PostgresAlbumRepository
        },
        {
            provide: SongRepository,
            useExisting: PostgresSongRepository
        },
        {
            provide: GenreRepository,
            useExisting: PostgresGenreRepository
        }
    ],
    imports:[
        MusicLibraryGrpcModule
    ]
})
export class MusicCatalogModule {}

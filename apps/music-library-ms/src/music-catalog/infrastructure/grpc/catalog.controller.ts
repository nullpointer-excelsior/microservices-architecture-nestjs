import { Metadata, ServerUnaryCall } from "@grpc/grpc-js"
import { Controller } from "@nestjs/common"
import { GrpcMethod } from "@nestjs/microservices"
import { Observable } from "rxjs"
import { CatalogUseCases } from "../../application/catalog.use-cases"
import { Artist } from "../../domain/models/artist.model"
import { Genre } from "../../domain/models/genre.model"
import { Song } from "../../domain/models/song.model"
import { ID } from "@lib/music-library-grpc"
import { Album } from "../../../../../../libs/music-library-api/src"

@Controller()
export class CatalogController {

    constructor(private catalog: CatalogUseCases) { }

    @GrpcMethod('ArtistService', 'GetAllArtists')
    getAllArtists(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
        return this.catalog.findAllArtists()
    }

    @GrpcMethod('ArtistService', 'GetArtistById')
    getArtistById(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
        return this.catalog.findArtistById(data.id)
    }

    @GrpcMethod('AlbumService', 'GetAlbumsByArtistId')
    getAlbumsByArtistId(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Album> {
        return this.catalog.findAlbumsByArtistId(data.id)
    }

    @GrpcMethod('AlbumService', 'GetAlbumsById')
    getAlbumsById(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Album> {
        return this.catalog.findAlbumById(data.id)
    }

    @GrpcMethod('AlbumService', 'GetAllAlbums')
    getAllAlbums(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Album> {
        return this.catalog.findAllAlbums()
    }

    @GrpcMethod('SongService', 'GetSongById')
    getSongById(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.catalog.findSongById(data.id)
    }

    @GrpcMethod('SongService', 'GetSongsByIds')
    getSongsByIds(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.catalog.findSongsByIdIn(data.id)
    }

    @GrpcMethod('SongService', 'GetSongsByArtistId')
    getSongsByArtistId(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.catalog.findSongsByArtistId(data.id)
    }

    @GrpcMethod('SongService', 'GetSongsByAlbumId')
    getSongsByAlbumId(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.catalog.findSongsByAlbumId(data.id)
    }

    @GrpcMethod('SongService', 'GetSongsByGenreId')
    getSongsByGenreId(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.catalog.findSongsByGenreId(data.id)
    }

    @GrpcMethod('GenreService', 'GetAllGenres')
    getAllGenres(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Genre> {
        return this.catalog.findAllGenres()
    }

    @GrpcMethod('GenreService', 'GetGenreById')
    getGenreById(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Genre> {
        return this.catalog.findGenreById(data.id)
    }

}

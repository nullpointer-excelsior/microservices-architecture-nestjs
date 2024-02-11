import { Metadata, ServerUnaryCall } from "@grpc/grpc-js"
import { Controller, Logger } from "@nestjs/common"
import { GrpcMethod } from "@nestjs/microservices"
import { Observable, from } from "rxjs"
import { CatalogUseCases } from "../../application/catalog.use-cases"
import { Artist } from "../../domain/models/artist.model"
import { Genre } from "../../domain/models/genre.model"
import { Song } from "../../domain/models/song.model"
import { ID } from "@lib/music-library-grpc"
import { Album } from "@lib/music-library-api"
import { promiseListToObservable } from "./utils/promise-list-to-observable"

@Controller()
export class CatalogController {

    private readonly logger = new Logger(CatalogController.name);

    constructor(private catalog: CatalogUseCases) { }

    @GrpcMethod('ArtistService', 'GetAllArtists')
    getAllArtists(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
        this.logger.log('Executing getAllArtists grpc method');
        return promiseListToObservable(this.catalog.findAllArtists())
    }

    @GrpcMethod('ArtistService', 'GetArtistById')
    getArtistById(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
        this.logger.log('Executing getArtistById grpc method');
        return from(this.catalog.findArtistById(data.id))
    }

    @GrpcMethod('AlbumService', 'GetAlbumsByArtistId')
    getAlbumsByArtistId(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Album> {
        this.logger.log('Executing getAlbumsByArtistId grpc method');
        return promiseListToObservable(this.catalog.findAlbumsByArtistId(data.id))
    }

    @GrpcMethod('AlbumService', 'GetAlbumsById')
    getAlbumById(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Album> {
        this.logger.log('Executing getAlbumById grpc method');
        return from(this.catalog.findAlbumById(data.id))
    }

    @GrpcMethod('AlbumService', 'GetAllAlbums')
    getAllAlbums(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Album> {
        this.logger.log('Executing getAllAlbums grpc method');
        return promiseListToObservable(this.catalog.findAllAlbums())
    }

    @GrpcMethod('SongService', 'GetSongById')
    getSongById(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        this.logger.log('Executing getSongById grpc method');
        return from(this.catalog.findSongById(data.id))
    }

    @GrpcMethod('SongService', 'GetSongsByIds')
    getSongsByIds(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        this.logger.log('Executing getSongsByIds grpc method');
        return promiseListToObservable(this.catalog.findSongsByIdIn(data.id))
    }

    @GrpcMethod('SongService', 'GetSongsByArtistId')
    getSongsByArtistId(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        this.logger.log('Executing getSongsByArtistId grpc method');
        return promiseListToObservable(this.catalog.findSongsByArtistId(data.id))
    }

    @GrpcMethod('SongService', 'GetSongsByAlbumId')
    getSongsByAlbumId(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        this.logger.log('Executing getSongsByAlbumId grpc method');
        return promiseListToObservable(this.catalog.findSongsByAlbumId(data.id))
    }

    @GrpcMethod('SongService', 'GetSongsByGenreId')
    getSongsByGenreId(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        this.logger.log('Executing getSongsByGenreId grpc method');
        return promiseListToObservable(this.catalog.findSongsByGenreId(data.id))
    }

    @GrpcMethod('GenreService', 'GetAllGenres')
    getAllGenres(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Genre> {
        this.logger.log('Executing getAllGenres grpc method');
        return promiseListToObservable(this.catalog.findAllGenres())
    }

    @GrpcMethod('GenreService', 'GetGenreById')
    getGenreById(data: ID, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Genre> {
        this.logger.log('Executing getGenreById grpc method');
        return from(this.catalog.findGenreById(data.id))
    }

}

import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Artist, Genre, Song } from '@lib/music-library-api';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable, mergeMap } from 'rxjs';
import { MusicLibraryService } from '../services/music-library.service';

@Controller()
export class CatalogController {

    constructor(private musicLibrary: MusicLibraryService) { }

    @GrpcMethod('ArtistService', 'GetAllArtists')
    getAllArtists(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
         return this.musicLibrary.findAllArtists().pipe(
            mergeMap(a => a)
         )
    }

    @GrpcMethod('ArtistService', 'GetArtistById')
    getArtistById(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
        return this.musicLibrary.findArtistById(data.ID)
    }

    @GrpcMethod('AlbumService', 'GetAlbumsByArtistId')
    getAlbumsByArtistId(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
        return this.musicLibrary.findArtistById(data.ID)
    }

    @GrpcMethod('AlbumService', 'GetAlbumsById')
    getAlbumsById(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
        return this.musicLibrary.findArtistById(data.ID)
    }

    @GrpcMethod('AlbumService', 'GetAllAlbums')
    getAllAlbums(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Artist> {
        return this.musicLibrary.findArtistById(data.ID)
    }

    @GrpcMethod('SongService', 'GetSongById')
    getSongById(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.musicLibrary.findSongById(data.ID)
    }

    @GrpcMethod('SongService', 'GetSongsByIds')
    getSongsByIds(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.musicLibrary.findSongById(data.ID)
    }

    @GrpcMethod('SongService', 'GetSongsByArtistId')
    getSongsByArtistId(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.musicLibrary.findSongById(data.ID)
    }

    @GrpcMethod('SongService', 'GetSongsByAlbumId')
    getSongsByAlbumId(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.musicLibrary.findSongById(data.ID)
    }

    @GrpcMethod('SongService', 'GetSongsByGenreId')
    getSongsByGenreId(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Song> {
        return this.musicLibrary.findSongById(data.ID)
    }

    @GrpcMethod('GenreService', 'GetAllGenres')
    getAllGenres(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Genre[]> {
        return this.musicLibrary.findAllGenres()
    }

    @GrpcMethod('GenreService', 'GetGenreById')
    getGenreById(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Observable<Genre> {
        return this.musicLibrary.findGenreById(data.ID)
    }

}


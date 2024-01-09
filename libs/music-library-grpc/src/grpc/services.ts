import { Observable } from "rxjs";
import { Album, Artist, Genre, ID, Song } from "./messages";

export interface ArtistService {
    GetAllArtists({}): Observable<Artist>;
    GetArtistById(request: ID): Observable<Artist>;
}

export interface AlbumService {
    GetAllAlbums({}): Observable<Album>;
    GetAlbumById(request: ID): Observable<Album>;
    GetAlbumsByArtistId(request: ID): Observable<Album>;
}

export interface SongService { 
    GetAllSongs({}): Observable<Song[]>;
    GetSongById(request: ID): Observable<Song>;
    GetSongsByIds(request: ID[]): Observable<Song>;
    GetSongsByArtistId(request: ID): Observable<Song>;
    GetSongsByAlbumId(request: ID): Observable<Song>;
    GetSongsByGenreId(request: ID): Observable<Song>;
 }

export interface GenreService {
    GetAllGenres({}): Observable<Genre>;
    GetGenreById(request: ID): Observable<Genre>;
}
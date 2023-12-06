import { Injectable } from "@nestjs/common";
import { Album, AlbumAPI, Artist, ArtistAPI, Genre, GenreAPI, Song, SongAPI } from "@lib/music-library-api";
import { Observable } from "rxjs";


@Injectable()
export class MusicLibraryService {

    constructor(
        private readonly albumAPI: AlbumAPI,
        private readonly artistAPI: ArtistAPI,
        private readonly genreAPI: GenreAPI,
        private readonly songAPI: SongAPI
    ) {}

    findAlbumById(id: string): Observable<Album> {
        return this.albumAPI.findById(id);
    }

    findAlbumByArtistId(id: string): Observable<Album> {
        return this.albumAPI.findByArtistId(id);
    }

    findArtistById(id: string): Observable<Artist> {
        return this.artistAPI.findById(id);
    }

    findAllArtists(): Observable<Artist[]> {
        return this.artistAPI.findAll();
    }

    findGenreById(id: string): Observable<Genre> {
        return this.genreAPI.findById(id);
    }

    findAllGenres(): Observable<Genre[]> {
        return this.genreAPI.findAll();
    }

    findSongById(id: string): Observable<Song> {
        return this.songAPI.findById(id);
    }

    findSongsByIds(ids: string[]): Observable<Song[]> {
        return this.songAPI.findByIdIn(ids);
    }

    findSongsByAlbumId(id: string): Observable<Song[]> {
        return this.songAPI.findByAlbumId(id);
    }

    findSongsByGenreId(id: string): Observable<Song[]> {
        return this.songAPI.findByGenreId(id);
    }

}

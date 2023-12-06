import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AlbumService, ArtistService, GenreService, SongService } from './grpc/services';

@Injectable()
export class MusicCatalogClient implements OnModuleInit {

    private artistService: ArtistService;
    private albumService: AlbumService;
    private songService: SongService;
    private genreService: GenreService;
    
    constructor(@Inject('MUSIC_CATALOG_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.artistService = this.client.getService<ArtistService>('ArtistService');
        this.albumService = this.client.getService<AlbumService>('AlbumService');
        this.songService = this.client.getService<SongService>('SongService');
        this.genreService = this.client.getService<GenreService>('GenreService');
    }

    findAllArtists() {
        return this.artistService.GetAllArtists({});
    }

    findArtistById(id: string) {
        return this.artistService.GetArtistById({ id });
    }   

    findAllAlbums() {
        return this.albumService.GetAllAlbums({});
    }

    findAlbumById(id: string) {
        return this.albumService.GetAlbumById({ id });
    }

    findAlbumsByArtistId(id: string) {
        return this.albumService.GetAlbumsByArtistId({ id });
    }   

    findAllSongs() {
        return this.songService.GetAllSongs({});
    }

    findSongById(id: string) {
     return this.songService.GetSongById({ id });
    }

    findSongsByIds(ids: string[]) {
        return this.songService.GetSongsByIds(ids.map(id => ({ id })));
    }

    findSongsByArtistId(id: string) {
        return this.songService.GetSongsByArtistId({ id });
    }
    
    findSongsByAlbumId(id: string) {
        return this.songService.GetSongsByAlbumId({ id });
    }

    findSongsByGenreId(id: string) {
        return this.songService.GetSongsByGenreId({ id });
    }

    findAllGenres() {
        return this.genreService.GetAllGenres({});
    }

    findGenreById(id: string) {
        return this.genreService.GetGenreById({ id });
    }

}

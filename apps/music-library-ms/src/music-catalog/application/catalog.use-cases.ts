import { Injectable } from "@nestjs/common";
import { from, mergeMap, tap } from "rxjs";
import { AlbumRepository } from "../domain/repositories/album.repository";
import { ArtistRepository } from "../domain/repositories/artist.repository";
import { GenreRepository } from "../domain/repositories/genre.repository";
import { SongRepository } from "../domain/repositories/song.repository";


@Injectable()
export class CatalogUseCases {
    
    constructor(
        private readonly artistRepository: ArtistRepository,
        private readonly songRepository: SongRepository,
        private readonly genreRepository: GenreRepository,
        private readonly albumRepository: AlbumRepository
    ) {}

    findAllArtists() {
        return from(this.artistRepository.findAll()).pipe(
           mergeMap(identity => identity)
        )
    }
    
    findArtistById(id: string) {
        return from(this.artistRepository.findById(id))
    }

    findAllSongs() {
        return from(this.songRepository.findAll()).pipe(
            mergeMap(identity => identity)
        )
    }
    
    findSongById(id: string) {
        return from(this.songRepository.findById(id))
    }

    findSongsByIdIn(ids: string[]) {
        return from(this.songRepository.findByIdIn(ids)).pipe(
            mergeMap(identity => identity)
        )
    }

    findSongsByAlbumId(albumId: string) {     
        return from(this.songRepository.findByAlbumId(albumId)).pipe(
            mergeMap(identity => identity)
        )
    }

    findSongsByArtistId(artistId: string) {     
        return from(this.songRepository.findByArtistId(artistId)).pipe(
            mergeMap(identity => identity)
        )
    }

    findSongsByGenreId(genreId: string) {     
        return from(this.songRepository.findByGenreId(genreId)).pipe(
            mergeMap(identity => identity)
        )
    }

    findAllGenres() {
        return from(this.genreRepository.findAll()).pipe(
            mergeMap(identity => identity)
        )
    }

    findGenreById(id: string) {
        return from(this.genreRepository.findById(id))
    }

    findAlbumById(id: string) {
        return from(this.albumRepository.findById(id))
    }

    findAllAlbums() {     
        return from(this.albumRepository.findAll()).pipe(
            mergeMap(identity => identity)
        )
    }

    findAlbumsByArtistId(artistId: string) {     
        return from(this.albumRepository.findByArtistId(artistId)).pipe(
            mergeMap(identity => identity),
        )
    }
    
}

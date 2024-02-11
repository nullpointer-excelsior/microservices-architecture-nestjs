import { Injectable } from "@nestjs/common";
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
        return this.artistRepository.findAll()
    }
    
    findArtistById(id: string) {
        return this.artistRepository.findById(id)
    }

    findAllSongs() {
        return this.songRepository.findAll()
    }
    
    findSongById(id: string) {
        return this.songRepository.findById(id)
    }

    findSongsByIdIn(ids: string[]) {
        return this.songRepository.findByIdIn(ids)
    }

    findSongsByAlbumId(albumId: string) {     
        return this.songRepository.findByAlbumId(albumId)
    }

    findSongsByArtistId(artistId: string) {     
        return this.songRepository.findByArtistId(artistId)
    }

    findSongsByGenreId(genreId: string) {     
        return this.songRepository.findByGenreId(genreId)
    }

    findAllGenres() {
        return this.genreRepository.findAll()
    }

    findGenreById(id: string) {
        return this.genreRepository.findById(id)
    }

    findAlbumById(id: string) {
        return this.albumRepository.findById(id)
    }

    findAllAlbums() {     
        return this.albumRepository.findAll()
    }

    findAlbumsByArtistId(artistId: string) {     
        return this.albumRepository.findByArtistId(artistId)
    }
    
}

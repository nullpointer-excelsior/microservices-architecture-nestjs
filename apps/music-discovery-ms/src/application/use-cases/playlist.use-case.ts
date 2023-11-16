import { Injectable } from "@nestjs/common";
import { UpdateNewForYouByGenderPlaylistDto } from "../dto/update-new-for-you-by-genre-playlist.dto";
import { PlaylistRepository } from "../../domain/repositories/playlist.repository";
import { forkJoin, map, switchMap } from "rxjs";
import { ArtistAPI } from "../../../../../libs/music-library-api/src/api/artist.api";
import { GenreAPI } from "../../../../../libs/music-library-api/src/api/genre.api";
import { AlbumAPI } from "../../../../../libs/music-library-api/src/api/album.api";

@Injectable()
export class PlaylistUseCase {

    constructor(
        private readonly playlistRepository: PlaylistRepository,
        private readonly genreAPI: GenreAPI,
        private readonly artistAPI: ArtistAPI,
        private readonly albumAPI: AlbumAPI,
    ) { }

    async updateNewForYouByGenderPlayslists(dto: UpdateNewForYouByGenderPlaylistDto) {
        
        forkJoin([
            this.albumAPI.findById(dto.albumId),
            this.genreAPI.findbyId(dto.genreId)
        ])
    }

}
import { Injectable } from "@nestjs/common";
import { createPlaylistEntity } from "../domain/factory/create-playlist-entity";
import { PlaylistModel } from "../domain/model/playlist.model";
import { PlaylistRepository } from "../domain/repository/playlist.repository";
import { SongRepository } from "../domain/repository/song.repository";
import { UserRepository } from "../domain/repository/user.repository";
import { CreatePlayListRequest } from "../infrastructure/restful-api/model/create-playlist.request";
import { createPLaylistModel } from "../domain/factory/create-playlist-model";
import { Playlist } from "../../shared/database/entities/playlist.entity";


@Injectable()
export class PlayListUseCases {

    constructor(
        private userRepository: UserRepository,
        private songRepository: SongRepository,
        private playlistRepository: PlaylistRepository
    ) { }

    async create(request: CreatePlayListRequest): Promise<PlaylistModel> {

        const songs = await this.songRepository.findByIds(request.songIds)
        const user = await this.userRepository.findById(request.userId)

        const playlist = createPlaylistEntity({
            name: request.name,
            user: user,
            songs: songs
        })

        return this.playlistRepository
            .save(playlist)
            .then(saved => createPLaylistModel(saved))

    }

    async findByUserId(id: string): Promise<PlaylistModel[]> {
        
        const mapEntities = (playlists: Playlist[]) => playlists.map(playlist => createPLaylistModel(playlist))

        return this.playlistRepository
            .findByUserId(id)
            .then(playlists => mapEntities(playlists))
            
    }

}
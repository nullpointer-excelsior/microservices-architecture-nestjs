import { Injectable } from "@nestjs/common";
import { Playlist } from "../../shared/database/entities/playlist.entity";
import { createPlaylistEntity } from "../domain/factory/create-playlist-entity";
import { createPLaylistModel } from "../domain/factory/create-playlist-model";
import { PlaylistModel } from "../domain/model/playlist.model";
import { PlaylistService } from "../domain/service/playlist.service";
import { SongService } from "../domain/service/song.service";
import { UserService } from "../domain/service/user.service";
import { CreatePlayListRequest } from "../infrastructure/restful-api/dto/create-playlist.request";
import { EntityCreatedResponse as CreatedEntityResponse } from "../infrastructure/restful-api/dto/entity-created.response";


@Injectable()
export class PlayListUseCases {

    constructor(
        private user: UserService,
        private song: SongService,
        private playlist: PlaylistService
    ) { }

    async create(request: CreatePlayListRequest): Promise<CreatedEntityResponse> {

        const songs = await this.song.findByIds(request.songIds)
        const user = await this.user.findById(request.userId)

        const playlist = createPlaylistEntity({
            name: request.name,
            user: user,
            songs: songs
        })

        return this.playlist
            .save(playlist)
            .then(entity => new CreatedEntityResponse(entity.id))

    }

    async findByUserId(id: string): Promise<PlaylistModel[]> {
        
        const mapEntities = (playlists: Playlist[]) => playlists.map(playlist => createPLaylistModel(playlist))

        return this.playlist
            .findByUserId(id)
            .then(playlists => mapEntities(playlists))
            
    }

}
import { Inject, Injectable } from "@nestjs/common";
import { PlaylistEntity } from "../domain/entity/playlist";
import { PlaylistRepository } from "../domain/repository/PlaylistRepository";
import { UserRepository } from "../domain/repository/UserRepository";
import { SongRepository } from "../domain/repository/SongRepository";
import { SONG_REPOSITORY, PLAYLIST_REPOSITORY, USER_REPOSITORY } from "../providers.token";

export type CreatePlayListDTO = {
    userId: string
    name: string;
    songIds: string[] 
}

@Injectable()
export class PlayListUseCases {

    constructor(
        @Inject(SONG_REPOSITORY) private songRepository: SongRepository, 
        @Inject(PLAYLIST_REPOSITORY) private playListRepository: PlaylistRepository,
        @Inject(USER_REPOSITORY) private userRepository: UserRepository
    ) {}

    async create(dto: CreatePlayListDTO) {
        const songs = await this.songRepository.findByIds(dto.songIds)
        const user = await this.userRepository.findById(dto.userId)
        const playlist = PlaylistEntity.create({ 
            name: dto.name,
            songs: songs,
            user: user
        })
        return await this.playListRepository.save(playlist)
    }

    findByUserId(id: string): Promise<PlaylistEntity[]> {
        return this.playListRepository.findByUserId(id)
    }

}
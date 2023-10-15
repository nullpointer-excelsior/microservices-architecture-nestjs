import { Injectable } from "@nestjs/common";
import { SongRepository } from "../domain/repository/song.repository";
import { Playlist } from "../../shared/database/entities/playlist.entity";
import { UserRepository } from "../domain/repository/user.repository";
import { PlaylistRepository } from "../domain/repository/playlist.repository";

export type CreatePlayList = {
    userId: string
    name: string;
    songIds: string[] 
}

@Injectable()
export class PlayListUseCases {

    constructor(
        private songRepository: SongRepository, 
        private userRepository: UserRepository,
        private playListRepository: PlaylistRepository
    ) {}

    async create(createPlayList: CreatePlayList) {
        const songs = await this.songRepository.findByIds(createPlayList.songIds)
        const playlist = new Playlist()
        playlist.name = createPlayList.name
        playlist.songs = songs
        playlist.user = await this.userRepository.findById(createPlayList.userId)
        playlist.duration = songs.map(song => song.duration).reduce((prev, curr) => prev + curr, 0)
        return await this.playListRepository.create(playlist)
    }

    update() {}

    findByUserId(id: string) {}

    findAll() {}

    delete(id: string) {}
}
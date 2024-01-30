import { Injectable } from "@nestjs/common";
import { Playlist } from "../model/playlist.model";
import { PlaylistRepository } from "../repositories/playlist.repository";

@Injectable()
export class PlaylistService {

    constructor(
        private readonly repository: PlaylistRepository,
    ) { }

    async create(playlist: Playlist): Promise<void> {
        this.repository.save(playlist)
    }

    async findAll(): Promise<Playlist[]> {
        return this.repository.findAll();
    }

}
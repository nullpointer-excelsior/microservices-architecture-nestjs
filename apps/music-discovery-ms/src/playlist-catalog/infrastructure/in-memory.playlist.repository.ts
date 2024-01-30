import { Injectable } from "@nestjs/common";
import { PlaylistRepository } from "../domain/repositories/playlist.repository";
import { Playlist } from "../domain/model/playlist.model";

@Injectable()
export class InMemoryPlaylistRepository extends PlaylistRepository {
    
    private playlists: any[];
    
    constructor() {
        super();
        this.playlists = [];
    }

    async save(playlist: Playlist): Promise<void> {
        this.playlists.push(playlist);
    }

    findAll(): Promise<Playlist[]> {
        return Promise.resolve(this.playlists);
    }

}
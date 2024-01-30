import { Playlist } from "../model/playlist.model";

export abstract class PlaylistRepository {
    abstract save(playlist: Playlist): Promise<void>
    abstract findAll(): Promise<Playlist[]>
}
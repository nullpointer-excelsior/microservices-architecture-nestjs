import { Playlist } from "../../../shared/database/entities/playlist.entity"
import { PlaylistModel } from "../model/playlist.model"


export function createPLaylistModel(entity: Playlist) {
    const playlist = new PlaylistModel()
    playlist.id = entity.id
    playlist.name = entity.name
    playlist.duration = entity.duration
    playlist.songs = entity.songs
    return playlist
}
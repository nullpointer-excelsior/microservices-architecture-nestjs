import { Playlist } from "../../../shared/database/entities/playlist.entity"
import { Song } from "../../../shared/database/entities/song.entity"
import { User } from "../../../shared/database/entities/user.entity"


export function createPlaylistEntity(dto: { name: string, user: User, songs: Song[] }) {
    const { name, songs, user } = dto
    const playlist = new Playlist()
    playlist.name = name
    playlist.duration = songs.map(s => s.duration).reduce((prev, curr) => prev + curr, 0)
    playlist.songs = songs
    playlist.user = user
    return playlist
}
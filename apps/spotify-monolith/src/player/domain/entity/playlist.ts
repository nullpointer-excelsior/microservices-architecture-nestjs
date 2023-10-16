import { SongEntity } from "./song";
import { UserEntity } from "./user";

export class PlaylistEntity {

    id: string;
  
    name: string;
  
    get duration(): number {
      return this.songs
        .map(song => song.duration)
        .reduce((prev, curr) => prev + curr, 0)
    }
    
    songs: SongEntity[];
  
    user: UserEntity;

    static create(dto: { name: string, songs: SongEntity[], user: UserEntity}) {
      const playlist = new PlaylistEntity()
      playlist.name = dto.name
      playlist.songs = dto.songs
      playlist.user = dto.user
      return playlist
    }
  
  }
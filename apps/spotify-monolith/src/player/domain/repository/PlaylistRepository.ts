import { PlaylistEntity } from "../entity/playlist";

export interface PlaylistRepository {

    findByUserId(id: string): Promise<PlaylistEntity[]>
  
    save(playlist: PlaylistEntity): Promise<PlaylistEntity>
    
  }
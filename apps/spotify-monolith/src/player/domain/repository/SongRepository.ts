import { SongEntity } from "../entity/song";

export interface SongRepository {
    
    findByIds(ids: string[]): Promise<SongEntity[]>;

}
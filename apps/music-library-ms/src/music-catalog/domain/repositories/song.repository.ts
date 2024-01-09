import { Song } from "../models/song.model";

export abstract class SongRepository {  
    abstract findAll(): Promise<Song[]>;
    abstract findById(id: string): Promise<Song>;
    abstract findByIdIn(ids: string[]): Promise<Song[]>;
    abstract findByArtistId(artistId: string): Promise<Song[]>;
    abstract findByAlbumId(albumId: string): Promise<Song[]>;
    abstract findByGenreId(genreId: string): Promise<Song[]>;
}
import { Album } from "../models/album.model";

export abstract class AlbumRepository {
    abstract findAll(): Promise<Album[]>;
    abstract findById(id: string): Promise<Album>;
    abstract findByArtistId(id: string): Promise<Album[]>;
}
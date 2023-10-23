import { Album } from "../database/entities/album.entity";

export class AlbumCreatedEvent {

    constructor(public album: Album) {}
    
}
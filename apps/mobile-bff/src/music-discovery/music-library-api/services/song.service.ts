import { Injectable } from "@nestjs/common";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";

@Injectable()
export class SongService {

    constructor(private client: MusicLibraryCLient) { }

    findByAlbumId(id: string) {
        return this.client.get(`songs/album/${id}`)
    }

    findByGenreId(id: string) {
        return this.client.get(`songs/genre/${id}`)
    }

}
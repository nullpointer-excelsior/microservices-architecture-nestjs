import { Injectable } from "@nestjs/common";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";

@Injectable()
export class AlbumService {

    constructor(private client: MusicLibraryCLient) { }

    findByArtistId(id: string) {
        return this.client.get(`albums/artist/${id}`)
    }

}
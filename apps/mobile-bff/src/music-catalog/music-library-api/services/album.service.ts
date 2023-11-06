import { Injectable } from "@nestjs/common";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";
import { Span } from "nestjs-otel";

@Injectable()
export class AlbumService {

    constructor(private client: MusicLibraryCLient) { }

    @Span("AlbumService/findArtistById")
    findByArtistId(id: string) {
        return this.client.get(`albums/artist/${id}`)
    }

}
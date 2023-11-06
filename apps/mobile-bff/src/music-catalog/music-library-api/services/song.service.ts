import { Injectable } from "@nestjs/common";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";
import { Span } from "nestjs-otel";

@Injectable()
export class SongService {

    constructor(private client: MusicLibraryCLient) { }

    @Span("SongService/findByAlbumId")
    findByAlbumId(id: string) {
        return this.client.get(`songs/album/${id}`)
    }

    @Span("SongService/findByGenreId")
    findByGenreId(id: string) {
        return this.client.get(`songs/genre/${id}`)
    }

}
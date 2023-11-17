import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { MusicLibraryCLient } from "./client/music-library.client";
import { Song } from "../model/song.model";

@Injectable()
export class SongAPI {

    constructor(private client: MusicLibraryCLient) { }

    @Span("SongAPI/findByAlbumId")
    findByAlbumId(id: string) {
        return this.client.get<Song[]>(`songs/album/${id}`)
    }

    @Span("SongAPI/findByGenreId")
    findByGenreId(id: string) {
        return this.client.get<Song[]>(`songs/genre/${id}`)
    }

}
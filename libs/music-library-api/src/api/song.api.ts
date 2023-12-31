import { HttpClient } from "@lib/utils/http-client";
import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { Song } from "../model/song.model";

@Injectable()
export class SongAPI {

    constructor(private client: HttpClient) { }

    @Span("SongAPI/findById")
    findById(id: string) {
        return this.client.get<Song>(`songs/${id}`)
    }

    @Span("SongAPI/findByIdIn")
    findByIdIn(ids: string[]) {
        return this.client.get<Song[]>('songs/search', { 
            params: {
                ids
            }
        })
    }

    @Span("SongAPI/findByAlbumId")
    findByAlbumId(id: string) {
        return this.client.get<Song[]>(`songs/album/${id}`)
    }

    @Span("SongAPI/findByGenreId")
    findByGenreId(id: string) {
        return this.client.get<Song[]>(`songs/genre/${id}`)
    }

}
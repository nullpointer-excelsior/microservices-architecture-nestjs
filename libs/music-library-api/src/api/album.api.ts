import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { MusicLibraryCLient } from "./client/music-library.client";
import { Album } from "../model/album.model";

@Injectable()
export class AlbumAPI {

    constructor(private client: MusicLibraryCLient) { }

    @Span("AlbumAPI/findById")
    findById(id: string) {
        return this.client.get<Album>(`albums/${id}`)
    }

    @Span("AlbumAPI/findArtistById")
    findByArtistId(id: string) {
        return this.client.get<Album>(`albums/artist/${id}`)
    }

}
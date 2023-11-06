import { Injectable } from "@nestjs/common";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";
import { Span } from "nestjs-otel";

@Injectable()
export class GenreService {

    constructor(private client: MusicLibraryCLient) { }

    @Span("GenreService/findAll")
    findAll() {
        return this.client.get('genres')
    }

}
import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { MusicLibraryCLient } from "./client/music-library.client";
import { Genre } from "../model/genre.model";

@Injectable()
export class GenreAPI {

    constructor(private client: MusicLibraryCLient) { }


    @Span("GenreAPI/findById")
    findbyId(id: string) {
        return this.client.get<Genre[]>(`genres/${id}`)
    }
    
    @Span("GenreAPI/findAll")
    findAll() {
        return this.client.get<Genre[]>('genres')
    }

}
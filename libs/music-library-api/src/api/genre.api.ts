import { HttpClient } from "@lib/utils/http-client";
import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { Genre } from "../model/genre.model";

@Injectable()
export class GenreAPI {

    constructor(private client: HttpClient) { }


    @Span("GenreAPI/findById")
    findById(id: string) {
        return this.client.get<Genre>(`genres/${id}`)
    }
    
    @Span("GenreAPI/findAll")
    findAll() {
        return this.client.get<Genre[]>('genres')
    }

}
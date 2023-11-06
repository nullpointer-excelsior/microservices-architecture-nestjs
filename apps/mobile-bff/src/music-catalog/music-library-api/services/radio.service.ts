import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";

@Injectable()
export class RadioService {

    constructor(private client: MusicLibraryCLient) { }

    @Span("RadioService/findAll")
    findAll() {
        return this.client.get('radios')
    }

    @Span("RadioService/findById")
    findById(id: string){
        return this.client.get(`radios/${id}`)
    }

}
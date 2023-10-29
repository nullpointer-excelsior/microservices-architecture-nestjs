import { Injectable } from "@nestjs/common";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";

@Injectable()
export class GenreService {

    constructor(private client: MusicLibraryCLient) { }

    findAll() {
        return this.client.get('genres')
    }

}
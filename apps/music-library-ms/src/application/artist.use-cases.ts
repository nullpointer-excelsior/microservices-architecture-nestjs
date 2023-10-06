import { Injectable } from "@nestjs/common";
import { SongRepository } from "../infrastructure/persistence/song.repository";

@Injectable()
export class ArtistUseCases {

    constructor(private repository: SongRepository) {}

    findArtistNames() {
        return this.repository.findArtistNames()
    }
    
}
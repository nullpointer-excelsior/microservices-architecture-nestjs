import { Injectable } from "@nestjs/common";
import { SongRepository } from "../infrastructure/persistence/song.repository";
import { SongModel } from "../domain/model/song.model";

@Injectable()
export class SongUseCases {

    constructor(private repository: SongRepository) {}

    searchByContainsName(name: string): Promise<SongModel[]> {
        return this.repository.findByContainsName(name)
    }

    findByArtist(artist: string): Promise<SongModel[]> {
        return this.repository.findByArtist(artist)
    }

}
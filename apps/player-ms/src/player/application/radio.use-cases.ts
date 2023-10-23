import { Injectable } from "@nestjs/common";
import { CreateRadioRequest } from "../infrastructure/restful-api/dto/create-radio.request";
import { RadioService } from "../domain/service/radio.service";
import { Radio } from "../../shared/database/entities/radio.entity";
import { EntityCreatedResponse } from "../infrastructure/restful-api/dto/entity-created.response";
import { Album } from "../../shared/database/entities/album.entity";

@Injectable()
export class RadioUseCases {

    constructor(private radio: RadioService) {}

    async create(request: CreateRadioRequest) {
        return this.radio
            .save(request as Radio)
            .then(entity => new EntityCreatedResponse(entity.id))
    }

    async createLatestAmazingAlbumsRadio(album: Album) {
        const radio = new Radio()
        radio.genre = album.songs[0].genre
        radio.name  = `Listen the new ${album.artist.name}'s Album`
        radio.songs = album.songs
        await this.radio.save(radio)
    }

    async findByGenreId(id: string){
        return this.radio.findByGenreId(id)
    }

    async findAll() {
        return this.radio.findAll()
    }
}
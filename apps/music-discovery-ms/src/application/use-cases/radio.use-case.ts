import { Injectable } from "@nestjs/common";
import { UpdateGenreRadioDto } from "../dto/update-genre-radio.dto";
import { RadioApi } from "../../infrastructure/music-library-api/radio.api";
import { lastValueFrom, map } from "rxjs";
import { GenreApi } from "../../infrastructure/music-library-api/genre.api";

@Injectable()
export class RadioUseCase {

    constructor(
        private radioApi: RadioApi,
        private genreApi: GenreApi
    ){}

    async updateGenreRadio(dto: UpdateGenreRadioDto) {
        const genre = await lastValueFrom(this.genreApi.findById(dto.genreId))
        const radio = await lastValueFrom(this.radioApi.findAll().pipe(map(radios => radios.find(r => r.name ===`New on ${genre.name}`))))
        if (radio) {
            return this.radioApi.addSong(radio.id, dto.id)
        }
    }

}